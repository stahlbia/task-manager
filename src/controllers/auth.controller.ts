import { FastifyReply, FastifyRequest } from 'fastify'
import { LoginInput } from '../schemas/auth.schema'
import { usersTableSim } from '../routes/users.routes'
import bcryptjs from 'bcryptjs'

export async function loginHandler(
  req: FastifyRequest<{ Body: LoginInput }>,
  rep: FastifyReply,
) {
  const { email, password } = req.body

  const user = await usersTableSim.find((user) => user.email === email)
  const isMatch = user && (await bcryptjs.compare(password, user.password))
  if (!user || !isMatch) {
    return rep.status(401).send({ message: 'Invalid email or password' })
  }

  const payload = {
    id: user.user_id,
    email: user.email,
    name: user.name,
  }
  const token = req.jwt.sign(payload)

  rep.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
  })

  return rep.status(201).send({ accessToken: token })
}
