/* eslint-disable @typescript-eslint/no-unused-vars */
import { compare, hash } from 'bcrypt'
import { usersTableSim } from '../db/dbSimulator'
import { env } from '../env'
import { TokenPayload } from '../schemas/auth.schema'
import { UserWithoutSensitiveInfoSchema } from '../schemas/user.schema'

// In-memory blacklist
const tokenBlacklist = new Set<string>()

export async function login(
  email: string,
  password: string,
): Promise<{ payload: TokenPayload; user: UserWithoutSensitiveInfoSchema }> {
  const user = await usersTableSim.find((u) => u.email === email)
  const isMatch = user && (await compare(password, user.password_hash))
  if (!isMatch) throw new Error('Invalid email or password')

  const payload: TokenPayload = {
    user_id: user.user_id,
    expiresIn: env.EXPIRES_IN,
  }

  const { password_hash, password_salt, ...userWithoutPassword } = user
  return { payload, user: userWithoutPassword }
}

export async function logout(token: string | undefined) {
  if (!token) throw new Error('User not logged in')
  tokenBlacklist.add(token)
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token)
}
