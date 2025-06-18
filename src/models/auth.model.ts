import { usersTableSim } from '../db/dbSimulator'
import { compare } from 'bcrypt'
import { env } from '../env'
import { FastifyInstance } from 'fastify'

export class AuthService {
  static async login(email: string, password: string, app: FastifyInstance) {
    const user = usersTableSim.find((u) => u.email === email)
    if (!user || !(await compare(password, user.password))) {
      throw new Error('Invalid email or password')
    }

    const token = app.jwt.sign({
      user_id: user.user_id,
      expiresIn: env.EXPIRES_IN,
    })
    return { token, user }
  }

  static async logout(token: string, tokenBlacklist: Set<string>) {
    tokenBlacklist.add(token)
  }

  static isTokenBlacklisted(
    token: string,
    tokenBlacklist: Set<string>,
  ): boolean {
    return tokenBlacklist.has(token)
  }
}
