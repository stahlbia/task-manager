import { FastifyReply, FastifyRequest } from 'fastify'
import { LoginInput } from '../schemas/auth.schema'
import { usersTableSim } from '../routes/users.routes'
import { compare } from 'bcrypt'
import { authConfig } from '../configs/auth.config'

export async function loginHandler(
  req: FastifyRequest<{ Body: LoginInput }>,
  rep: FastifyReply,
) {
  const { email, password } = req.body

  // TODO: mudar para uma pesquisa no banco de dados
  // const userWithEmailAddress = await knex('users').where({ email }).first()

  // if (!userWithEmailAddress) {
  //   throw new AppError('invalid email or password', 401)
  // }

  const user = await usersTableSim.find((user) => user.email === email)
  const isMatch = user && (await compare(password, user.password))
  if (!user || !isMatch) {
    return rep.status(401).send({ message: 'invalid email or password' })
  }

  const { expiresIn } = authConfig.jwt

  const payload = {
    id: user.user_id,
    email: user.email,
    expiresIn,
  }
  const token = req.jwt.sign(payload)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user
  return rep.status(201).send({ accessToken: token, user: userWithoutPassword })
}
