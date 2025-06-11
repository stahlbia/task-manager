import { FastifyReply, FastifyRequest } from 'fastify'
import { UserInput } from '../schemas/user.schema'
import { randomUUID } from 'node:crypto'

export async function createUserHandler(
  request: FastifyRequest<{ Body: UserInput }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body

  const user: UserInput = {
    user_id: randomUUID(),
    name,
    email,
    password,
    is_deleted: false,
  }

  return reply.code(201).send(user)
}
