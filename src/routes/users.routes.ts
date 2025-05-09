import z from 'zod';
import { FastifyTypeInstance } from "../utils/fastifyTypeInstance";
import { randomUUID } from 'node:crypto';
import { userSchema, User } from '../schemas/user.schema';

// simulacao do banco
const users: User[] = []

export async function routes(app: FastifyTypeInstance) {
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
        return users
    })

    app.post('/users', {
        schema: {
            tags: ['users'],
            description: 'Create a new user',
            body: z.object({
                name: z.string(),
                email: z.string().email(),
            }),
            response: {
                201: userSchema.describe('Created user'),
            }
        }
    }, async (req, rep) => {
        const { name, email } = req.body

        const newUser: User = {
            id: randomUUID(),
            name,
            email,
        }

        users.push(newUser)

        return rep.status(201).send(newUser)
    })
}