import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput } from '../schemas/user.schema';

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const { name, email, password } = request.body;

  const user = {
    id: Date.now().toString(), 
    name,
    email,
  };

  return reply.code(201).send(user);
}
