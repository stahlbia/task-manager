import { FastifyReply, FastifyRequest } from 'fastify'
import {
  CreateUserInput,
  UpdateUserInput,
  UserParamsSchema,
} from '../schemas/user.schema'
import { sendNotification } from '../middlewares/send-notification.middleware'
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from '../models/user.model'
import { errorHandler } from '../middlewares/error-handling.middleware'

export async function createUserHandler(
  req: FastifyRequest<{ Body: CreateUserInput }>,
  rep: FastifyReply,
) {
  try {
    const createdUser = await createUser(req.body)
    sendNotification(createdUser.email, 'user_created', {
      user_name: createdUser.name,
    })
    return rep.status(201).send(createdUser)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function listUsersHandler(req: FastifyRequest, rep: FastifyReply) {
  const users = await listUsers()
  return rep.status(200).send(users)
}

export async function getUserHandler(req: FastifyRequest, rep: FastifyReply) {
  try {
    const { user_id } = req.params as UserParamsSchema
    const user = await getUserById(user_id)
    return rep.status(201).send(user)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function updateUserHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { user_id } = req.params as { user_id: string }
    const data = req.body as Partial<UpdateUserInput>
    const updatedUser = await updateUser(user_id, data)
    sendNotification(updatedUser.email, 'user_update')
    return rep.status(200).send(updatedUser)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function deleteUserHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { user_id } = req.params as { user_id: string }
    const deletedUser = await deleteUser(user_id)
    sendNotification(deletedUser.email, 'user_delete')
    return rep.status(204).send({ message: 'User deleted successfully!' })
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}
