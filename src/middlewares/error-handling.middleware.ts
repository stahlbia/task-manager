import { FastifyReply, FastifyRequest } from 'fastify'

export function errorHandling (error: any, req: FastifyRequest, rep: FastifyReply) {
    return rep.status(error.statusCode || 500).send({ error: error.message || 'Internal Server Error' })
}