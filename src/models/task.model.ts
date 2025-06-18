import { knex } from '../database'
import {
  CommentSchema,
  CreateTaskInput,
  CreateUpdateCommentInput,
  TaskSchema,
  taskStatus,
  UpdateTaskInput,
} from '../schemas/task.schema'
import { randomUUID } from 'crypto'

export async function createTask(
  user_id: string,
  data: CreateTaskInput,
): Promise<TaskSchema> {
  const { title, description } = data
  const dateNow = new Date()
  const newTask: TaskSchema = {
    task_id: randomUUID(),
    title,
    description,
    status: taskStatus.parse('pending'),
    created_by: user_id,
    assigned_to: user_id,
    updated_at: dateNow,
    created_at: dateNow,
  }

  await knex('tasks').insert(newTask)

  return newTask
}

export async function listTasks(user_id: string): Promise<TaskSchema[] | null> {
  const tasks = await knex('tasks').where('user_id', user_id).select('*')
  const transformedTasks = tasks.map((t) => ({
    ...t,
    updated_at: new Date(t.updated_at),
    created_at: new Date(t.created_at),
  }))
  return transformedTasks
}

export async function getTaskById(task_id: string): Promise<TaskSchema> {
  const task = await findTaskById(task_id)
  if (!task) throw new Error('Task not found')
  const transformedTask = transformTask(task)
  return transformedTask
}

export async function updateTask(
  task_id: string,
  data: Partial<UpdateTaskInput>,
): Promise<TaskSchema> {
  const task = await findTaskById(task_id)
  if (!task) throw new Error('Task not found')

  if (data.title)
    await knex('tasks').where('task_id', task_id).update('title', data.title)
  if (data.description)
    await knex('tasks')
      .where('task_id', task_id)
      .update('description', data.description)
  if (data.status)
    await knex('tasks').where('task_id', task_id).update('status', data.status)
  if (data.assigned_to)
    await knex('tasks')
      .where('task_id', task_id)
      .update('title', data.assigned_to)

  await knex('tasks').where('task_id', task_id).update('updated_at', new Date())
  const updatedTask = await knex('tasks')
    .where('task_id', task_id)
    .select('*')
    .first()

  const transformedTask = transformTask(updatedTask)

  return transformedTask
}

export async function deleteTask(task_id: string): Promise<TaskSchema> {
  const task = await findTaskById(task_id)
  if (!task) throw new Error('Task not found')

  await knex('tasks').where('task_id', task_id).delete()

  const transformedTask = transformTask(task)

  return transformedTask
}

async function findTaskById(task_id: string) {
  return await (await knex('tasks')).find((t) => t.task_id === task_id)
}

function transformTask(task: TaskSchema) {
  return {
    ...task,
    updated_at: new Date(task.updated_at),
    created_at: new Date(task.created_at),
  }
}

// --- Comments functions ---

export async function createComment(
  task_id: string,
  user_id: string,
  data: CreateUpdateCommentInput,
): Promise<CommentSchema> {
  const { content } = data
  const dateNow = new Date()
  const newComment: CommentSchema = {
    comment_id: randomUUID(),
    content,
    updated_at: dateNow,
    created_at: dateNow,
    task_id,
    user_id,
  }

  await knex('comments').insert(newComment)

  return newComment
}

export async function listComments(
  task_id: string,
): Promise<CommentSchema[] | null> {
  const comments = await knex('comments').where('task_id', task_id).select('*')
  const transformedComments = comments.map((c) => ({
    ...c,
    updated_at: new Date(c.updated_at),
    created_at: new Date(c.created_at),
  }))
  return transformedComments
}

export async function getCommentById(
  comment_id: string,
): Promise<CommentSchema> {
  const comment = await findCommentById(comment_id)
  if (!comment) throw new Error('Comment not found')
  const transformedComment = transformComment(comment)
  return transformedComment
}

export async function updateComment(
  comment_id: string,
  data: Partial<CreateUpdateCommentInput>,
): Promise<CommentSchema> {
  const comment = await findCommentById(comment_id)
  if (!comment) throw new Error('Comment not found')

  if (data.content)
    await knex('comments')
      .where('comment_id', comment_id)
      .update('content', data.content)

  await knex('comments')
    .where('comment_id', comment_id)
    .update('updated_at', new Date())
  const updatedComment = await knex('comments')
    .where('comment_id', comment_id)
    .select('*')
    .first()

  const transformedComment = transformComment(updatedComment)

  return transformedComment
}

export async function deleteComment(
  comment_id: string,
): Promise<CommentSchema> {
  const comment = await findCommentById(comment_id)
  if (!comment) throw new Error('Comment not found')

  await knex('comments').where('comment_id', comment_id).delete()

  const transformedComment = transformComment(comment)

  return transformedComment
}

async function findCommentById(comment_id: string) {
  return await (await knex('comments')).find((c) => c.comment_id === comment_id)
}

function transformComment(comment: CommentSchema) {
  return {
    ...comment,
    updated_at: new Date(comment.updated_at),
    created_at: new Date(comment.created_at),
  }
}
