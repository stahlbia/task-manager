import { FastifyReply, FastifyRequest } from 'fastify'
import { TokenPayload } from '../schemas/auth.schema'

export async function ensureAuthenticated(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return rep.status(401).send('unauthorized')
    }
    const token = authHeader
    const { user_id, expiresIn } = req.jwt.verify(token) as TokenPayload
    req.user = {
      user_id,
      expiresIn,
    }
  } catch (error) {
    return rep.status(401).send('unauthorized')
  }
}
