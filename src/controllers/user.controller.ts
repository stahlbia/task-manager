import { FastifyReply, FastifyRequest } from 'fastify'
import { UserSchema } from '../schemas/user.schema'
import { randomUUID } from 'node:crypto'

export async function createUserHandler(
  request: FastifyRequest<{ Body: UserSchema }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body

  const user: UserSchema = {
    user_id: randomUUID(),
    name,
    email,
    password,
    is_deleted: false,
  }

  return reply.code(201).send(user)
}
