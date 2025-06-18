import { FastifyRequest, FastifyReply } from 'fastify'
import {
  CreateTaskInput,
  CreateUpdateCommentInput,
  ParamsCommentSchema,
  ParamsTaskSchema,
  UpdateTaskInput,
} from '../schemas/task.schema'
import {
  createComment,
  createTask,
  deleteComment,
  deleteTask,
  getCommentById,
  getTaskById,
  listComments,
  listTasks,
  updateComment,
  updateTask,
} from '../models/task.model'
import { sendNotification } from '../middlewares/send-notification.middleware'
import { errorHandler } from '../middlewares/error-handling.middleware'

// --- Task Handlers ---

export async function createTaskHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const data = req.body as CreateTaskInput
    const createdTask = await createTask(req.loggedUser.user_id, data)
    sendNotification(req.loggedUser.email, 'task_create', {
      task_name: createdTask.title,
    })
    return rep.status(201).send(createdTask)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function listTasksHandler(req: FastifyRequest, rep: FastifyReply) {
  try {
    const { assigned_to } = req.query as {
      assigned_to: string
    }
    const tasks = await listTasks(assigned_to)
    return rep.status(200).send(tasks)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function getTaskHandler(req: FastifyRequest, rep: FastifyReply) {
  try {
    const { task_id } = req.params as ParamsTaskSchema
    const task = await getTaskById(task_id)
    return rep.status(201).send(task)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function updateTaskHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { task_id } = req.params as ParamsTaskSchema
    const data = req.body as Partial<UpdateTaskInput>
    const updatedTask = await updateTask(task_id, data)
    sendNotification(req.loggedUser.email, 'task_update', {
      task_name: updatedTask.title,
    })
    return rep.status(200).send(updatedTask)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function deleteTaskHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { task_id } = req.params as ParamsTaskSchema
    const deletedTask = await deleteTask(task_id)
    sendNotification(req.loggedUser.email, 'task_deleted', {
      task_name: deletedTask.title,
    })
    return rep.status(200).send({ message: 'Task deleted successfully!' })
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

// --- Comments Handlers ---

export async function createCommentHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { task_id } = req.params as ParamsCommentSchema
    const data = req.body as CreateUpdateCommentInput
    const createdComment = await createComment(
      task_id,
      req.loggedUser.user_id,
      data,
    )
    const onTask = await getTaskById(task_id)
    sendNotification(req.loggedUser.email, 'task_comment_create', {
      user_name: req.loggedUser.name,
      task_name: onTask.title,
    })
    return rep.status(201).send(createdComment)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function listCommentsHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const { task_id } = req.params as ParamsCommentSchema
  const comments = await listComments(task_id)
  return rep.status(200).send(comments)
}

export async function getCommentHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { comment_id } = req.params as ParamsCommentSchema
    const comment = await getCommentById(comment_id)
    return rep.status(201).send(comment)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function updateCommentHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { task_id, comment_id } = req.params as ParamsCommentSchema
    const data = req.body as Partial<CreateUpdateCommentInput>
    const updatedComment = await updateComment(comment_id, data)
    const onTask = await getTaskById(task_id)
    sendNotification(req.loggedUser.email, 'task_comment_updated', {
      task_name: onTask.title,
    })
    return rep.status(200).send(updatedComment)
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}

export async function deleteCommentHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { task_id, comment_id } = req.params as ParamsCommentSchema
    await deleteComment(comment_id)
    const onTask = await getTaskById(task_id)
    sendNotification(req.loggedUser.email, 'task_comment_deleted', {
      task_name: onTask.title,
    })
    return rep.status(200).send({ message: 'Comment deleted successfully!' })
  } catch (error) {
    const treatedError = errorHandler(error)
    return rep
      .status(treatedError.status)
      .send({ message: treatedError.message })
  }
}
