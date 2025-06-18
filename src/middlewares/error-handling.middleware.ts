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

export function errorHandler(error: unknown) {
  if (error instanceof Error) {
    return { status: 409, message: error.message }
  }
  return { status: 500, message: 'Internal server error' }
}
