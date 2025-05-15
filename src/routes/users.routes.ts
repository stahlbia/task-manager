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
        schema: { // esquema que aparecera na documentacao
            tags: ['users'], // tag para agrupar requests para users
            description: 'List users', // descricao do que o metodo faz nessa rota
            response: { // estruturas de respostas que a rota entrega para cada http code
                200: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                }))
            }
        }
    }, () => {
        return usersTableSim
    })

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
    })
}