import z from 'zod';
import { FastifyTypeInstance } from "../utils/types";
import { randomUUID } from 'node:crypto';
import { userSchema, UserInput } from '../schemas/user.schema';
import bcrypt from 'bcryptjs';
import { error } from 'node:console';

// simulacao do banco
export const usersTableSim: UserInput[] = []
const SALT_ROUNDS = 10

export async function userRoutes(app: FastifyTypeInstance) {
    app.get('/users', {
      schema: {
        tags: ['users'],
        description: 'List users',
        response: {
          200: z.array(userSchema.omit({ password: true })),
        }
      }
    }, () => {
      return usersTableSim.filter(u => !u.deleted).map(({ password, ...rest }) => rest); //soft delete
    });

    app.get('/users/:id', {
        schema: {
            tags: ['users'],
            description: 'Get an user by ID',
            response: {
                200: userSchema.omit({ password: true}),
                404: z.object({ message: z.string() }).describe('User not found'),
            },
        }
    }, async (req, rep) => {
        const {id} = req.params as {id: string};
        const user = usersTableSim.find(u => u.id === id && !u.deleted);

        if(!user)
            return rep.status(404).send({ message: 'User not found'});

        const { password, ...userWithoutPassowrd } = user;
        return rep.send(userWithoutPassowrd);
    });


    app.post('/users', {
        schema: {
            tags: ['users'],
            description: 'Create a new user',
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string().min(8),
            }),
            response: {
                201: userSchema.describe('Created user'),
                401: z.object({ message: z.string() }).describe('User already exists'),
                500: z.object({ message: z.string() }).describe('Internal server error'),
            }
        }
    }, async (req, rep) => {
        const { name, email, password } = req.body


        const user = usersTableSim.find((user) => user.email === email)
        if (user) {
            return rep.status(401).send({ message: 'User already exists' })
        }

        try {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
            const user: UserInput = {
                id: randomUUID(),
                name,
                email,
                password: hashedPassword,
            }
            usersTableSim.push(user)

            return rep.status(201).send(user)
        } catch (e) {
            return rep.status(500).send({ message: 'Internal server error' });
        }
    });

    app.put('/users/:id', {
        schema: {
          tags: ['users'],
          description: 'Update a user',
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            password: z.string().min(8).optional(),
          }),
          response: {
            200: userSchema.omit({ password: true }),
            404: z.object({ message: z.string() }).describe('User not found'),
          },
        }
      }, async (req, rep) => {
        const { id } = req.params as { id: string };
        const { name, email, password } = req.body as Partial<UserInput>;
    
        const user = usersTableSim.find(u => u.id === id && !u.deleted);
        if (!user) {
          return rep.status(404).send({ message: 'User not found' });
        }
    
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, SALT_ROUNDS);
    
        const { password: _, ...userWithoutPassword } = user;
        return rep.send(userWithoutPassword);
      });
    
      app.delete('/users/:id', {
        schema: {
          tags: ['users'],
          description: 'Soft delete a user',
          params: z.object({
            id: z.string(),
          }),
          response: {
            204: z.null(),
            404: z.object({ message: z.string() }).describe('User not found'),
          },
        }
      },async (req, rep) => {
        const { id } = req.params as { id: string };
        const user = usersTableSim.find(u => u.id === id && !u.deleted);
    
        if (!user) {
          return rep.status(404).send({ message: 'User not found' });
        }
    
        user.deleted = true;
        return rep.status(204).send();
      });
    }