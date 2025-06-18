/* eslint-disable @typescript-eslint/no-unused-vars */
import z from 'zod'
import { FastifyTypeInstance } from '../utils/types.utils'
import {
  createUserSchema,
  updateUserSchema,
  userWithoutSensitiveInfoSchema,
  paramsUserSchema,
} from '../schemas/user.schema'
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  listUsersHandler,
  updateUserHandler,
} from '../controllers/user.controller'
import { ensureAuthenticated } from '../middlewares/auth-handling.middleware'

export async function userRoutes(app: FastifyTypeInstance) {
  app.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'Create a new user',
        body: createUserSchema,
        response: {
          201: userWithoutSensitiveInfoSchema.describe('Created user'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
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

  app.get(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'List users',
        response: {
          200: z
            .array(userWithoutSensitiveInfoSchema)
            .describe('Get all users in activity'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    listUsersHandler,
  )

  app.get(
    '/users/:user_id',
    {
      schema: {
        tags: ['users'],
        description: 'Get an user by ID',
        params: paramsUserSchema,
        response: {
          200: userWithoutSensitiveInfoSchema.describe('Get one user'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          404: z.object({ message: z.string() }).describe('User not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    getUserHandler,
  )

  app.put(
    '/users/:user_id',
    {
      schema: {
        tags: ['users'],
        description: 'Update a user',
        params: paramsUserSchema,
        body: updateUserSchema,
        response: {
          200: userWithoutSensitiveInfoSchema.describe('Updated user'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          404: z.object({ message: z.string() }).describe('User not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    updateUserHandler,
  )

  app.delete(
    '/users/:user_id',
    {
      schema: {
        tags: ['users'],
        description: 'Soft delete a user',
        params: paramsUserSchema,
        response: {
          200: z
            .object({ message: z.string() })
            .describe('User deleted successfully'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          404: z.object({ message: z.string() }).describe('User not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    deleteUserHandler,
  )
}
