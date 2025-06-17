/* eslint-disable @typescript-eslint/no-unused-vars */
import z from 'zod'
import { FastifyTypeInstance } from '../utils/types'
import { randomUUID } from 'node:crypto'
import {
  createUserSchema,
  userSchema,
  UserSchema,
  updateUserSchema,
} from '../schemas/user.schema'
import bcrypt from 'bcrypt'
import { createUserHandler } from '../controllers/user.controller'
import { ensureAuthenticated } from '../middlewares/auth-handling.middleware'

// simulacao do banco
export const usersTableSim: UserSchema[] = []
const SALT_ROUNDS = 10

export async function userRoutes(app: FastifyTypeInstance) {
  app.get(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'List users',
        response: {
          200: z.array(userSchema.omit({ password: true })),
        },
      },
      preHandler: ensureAuthenticated,
    },
    () => {
      return usersTableSim
        .filter((u) => !u.is_deleted)
        .map(({ password, ...rest }) => rest) // soft delete
    },
  )

  app.get(
    '/users/:user_id',
    {
      schema: {
        tags: ['users'],
        description: 'Get an user by ID',
        params: z.object({ user_id: z.string() }),
        response: {
          200: userSchema.omit({ password: true }),
          404: z.object({ message: z.string() }).describe('User not found'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    async (req, rep) => {
      const { user_id } = req.params
      const user = usersTableSim.find(
        (u) => u.user_id === user_id && !u.is_deleted,
      )

      if (!user) return rep.status(404).send({ message: 'User not found' })

      const { password, ...userWithoutPassowrd } = user
      return rep.send(userWithoutPassowrd)
    },
  )

  app.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'Create a new user',
        body: createUserSchema,
        response: {
          201: userSchema.omit({ password: true }).describe('Created user'),
          409: z
            .object({ message: z.string() })
            .describe('User already exists'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
    },
    createUserHandler,
  )

  app.put(
    '/users/:user_id',
    {
      schema: {
        tags: ['users'],
        description: 'Update a user',
        params: z.object({
          user_id: z.string(),
        }),
        body: updateUserSchema,
        response: {
          200: userSchema.omit({ password: true }),
          404: z.object({ message: z.string() }).describe('User not found'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    async (req, rep) => {
      const { user_id } = req.params as { user_id: string }
      const {
        name,
        email,
        password: newPassword,
      } = req.body as Partial<UserSchema>

      const user = usersTableSim.find(
        (u) => u.user_id === user_id && !u.is_deleted,
      )
      if (!user) {
        return rep.status(404).send({ message: 'User not found' })
      }

      if (name) user.name = name
      if (email) user.email = email
      if (newPassword)
        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS)

      const { password: _, ...userWithoutPassword } = user
      return rep.send(userWithoutPassword)
    },
  )

  app.delete(
    '/users/:user_id',
    {
      schema: {
        tags: ['users'],
        description: 'Soft delete a user',
        params: z.object({
          user_id: z.string(),
        }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }).describe('User not found'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    async (req, rep) => {
      const { user_id } = req.params as { user_id: string }
      const user = usersTableSim.find(
        (u) => u.user_id === user_id && !u.is_deleted,
      )

      if (!user) {
        return rep.status(404).send({ message: 'User not found' })
      }

      user.is_deleted = true
      return rep.status(204).send()
    },
  )
}
