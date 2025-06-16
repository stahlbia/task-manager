import { FastifyReply, FastifyRequest } from 'fastify'
import { TokenPayload } from '../schemas/auth.schema'
import { isTokenBlacklisted } from '../controllers/auth.controller'

export async function ensureAuthenticated(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const token = req.headers.authorization
    if (!token || isTokenBlacklisted(token)) {
      return rep.status(401).send({ message: 'Unauthorized' })
    }

    const { user_id, expiresIn } = req.jwt.verify(token) as TokenPayload
    req.user = {
      user_id,
      expiresIn,
    }
  } catch (error) {
    return rep.status(401).send({ message: 'Unauthorized' })
  }
}
