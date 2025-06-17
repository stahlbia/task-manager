import { FastifyReply, FastifyRequest } from 'fastify'
import { LoginInput, LogoutInput } from '../schemas/auth.schema'
import { usersTableSim } from '../routes/users.routes'
import { compare } from 'bcrypt'
import { env } from '../env'

// In-memory blacklist
const tokenBlacklist = new Set<string>()

export async function loginHandler(
  req: FastifyRequest<{ Body: LoginInput }>,
  rep: FastifyReply,
) {
  const { email, password } = req.body

  const user = await usersTableSim.find((user) => user.email === email)
  const isMatch = user && (await compare(password, user.password))
  if (!user || !isMatch) {
    return rep.status(401).send({ message: 'invalid email or password' })
  }

  const payload = {
    id: user.user_id,
    expiresIn: env.EXPIRES_IN,
  }
  const token = req.jwt.sign(payload)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user
  return rep.status(201).send({ accessToken: token, user: userWithoutPassword })
}

export async function logoutHandler(
  req: FastifyRequest<{ Body: LogoutInput }>,
  rep: FastifyReply,
) {
  const token = req.headers.authorization
  if (!token) {
    return rep.status(400).send({ message: 'User not logged in' })
  }

  tokenBlacklist.add(token)

  return rep.status(201).send({ message: 'User logged out successfully' })
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token)
}
