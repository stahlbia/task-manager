import { FastifyReply, FastifyRequest } from 'fastify'
import { UserSchema } from '../schemas/user.schema'
import { randomUUID } from 'node:crypto'
import { hash } from 'bcrypt'
import { usersTableSim } from '../db/db'
import { sendNotification } from '../middlewares/send-notification.middleware'

const SALT_ROUNDS = 10

export async function createUserHandler(
  request: FastifyRequest<{ Body: UserSchema }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body

  const userWithSameEmail = usersTableSim.find((user) => user.email === email)
  if (userWithSameEmail) {
    return reply.code(409).send('User already exists')
  }

  try {
    const hasedPassword = await hash(password, SALT_ROUNDS)

    const user: UserSchema = {
      user_id: randomUUID(),
      name,
      email,
      password: hasedPassword,
      is_deleted: false,
      created_at: new Date()
    }
    
    usersTableSim.push(user)

    sendNotification(user.email, 'user_created', {user_name: user.name})

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user
    return reply.code(201).send(userWithoutPassword)
  } catch (e) {
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
