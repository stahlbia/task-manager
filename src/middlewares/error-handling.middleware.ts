import { FastifyReply, FastifyRequest } from 'fastify'

export function errorHandling(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const message = error.message || 'Internal Server Error'
  return rep.status(error.statusCode || 500).send({ message })
}
