import { FastifyReply, FastifyRequest } from 'fastify'
import { UserSchema } from '../schemas/user.schema'
import { randomUUID } from 'node:crypto'
import { hash } from 'bcrypt'
import { usersTableSim } from '../routes/users.routes'

const SALT_ROUNDS = 10

export async function createUserHandler(
  request: FastifyRequest<{ Body: UserSchema }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body

  // TODO: conferir se o email já está cadastrado no banco de dados
  // const userWithSameEmail = await knex('users').where({ email }).first()

  // if (userWithSameEmail) {
  //   throw new AppError('User already exists')
  // }

  const userWithSameEmail = usersTableSim.find((user) => user.email === email)
  if (userWithSameEmail) {
    return reply.code(401).send('User already exists')
  }

  try {
    const hasedPassword = await hash(password, SALT_ROUNDS)

    const user: UserSchema = {
      user_id: randomUUID(),
      name,
      email,
      password: hasedPassword,
      is_deleted: false,
    }

    // TODO: add user na tabela
    // const addedUser = await knex('users').insert(user).returning('*')
    // const { password: _, userWithoutPassword } = addedUser
    usersTableSim.push(user)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user
    return reply.code(201).send(userWithoutPassword)
  } catch (e) {
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
