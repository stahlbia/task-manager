/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify'
import { LoginInput } from '../schemas/auth.schema'
import { login, logout } from '../models/auth.model'
import { errorHandler } from '../middlewares/error-handling.middleware'

export async function loginHandler(req: FastifyRequest, rep: FastifyReply) {
  try {
    const { email, password } = req.body as LoginInput
    const { payload, user } = await login(email, password)
    const token = req.jwt.sign(payload)

    return rep.status(201).send({ accessToken: token, user })
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function logoutHandler(req: FastifyRequest, rep: FastifyReply) {
  try {
    const token = req.headers.authorization
    await logout(token)
    return rep.status(201).send({ message: 'User logged out successfully' })
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}
