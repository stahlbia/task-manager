import { FastifyReply, FastifyRequest } from 'fastify'
import { TokenPayload } from '../schemas/auth.schema'
import { isTokenBlacklisted } from '../controllers/auth.controller'
import { usersTableSim } from '../db/db'
import { UserSchema } from '../schemas/user.schema'

export async function ensureAuthenticated(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const token = req.headers.authorization
    if (!token || isTokenBlacklisted(token)) {
      return rep.status(401).send({ message: 'Unauthorized' })
    }
    const { user_id } = req.jwt.verify(token) as TokenPayload
    const user = usersTableSim.find((user) => user.user_id === user_id)
    req.loggedUser = user as UserSchema
  } catch (error) {
    return rep.status(401).send({ message: 'Unauthorized' })
  }
}
