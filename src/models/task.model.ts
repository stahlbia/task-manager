import { commentsTableSim, tasksTableSim } from '../db/dbSimulator'
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

  tasksTableSim.push(newTask)

  return newTask
}

export async function listTasks(user_id: string): Promise<TaskSchema[] | null> {
  return tasksTableSim.filter((t) => t.assigned_to === user_id)
}

export async function getTaskById(task_id: string): Promise<TaskSchema> {
  const task = findTaskById(task_id)
  if (!task) throw new Error('Task not found')
  return task
}

export async function updateTask(
  task_id: string,
  data: Partial<UpdateTaskInput>,
): Promise<TaskSchema> {
  const task = findTaskById(task_id)
  if (!task) throw new Error('Task not found')

  if (data.title) task.title = data.title
  if (data.description) task.description = data.description
  if (data.status) task.status = data.status
  if (data.assigned_to) task.assigned_to = data.assigned_to

  return task
}

export async function deleteTask(task_id: string): Promise<TaskSchema> {
  const task = findTaskById(task_id)
  if (!task) throw new Error('Task not found')

  const taskIndex = tasksTableSim.findIndex((t) => t.task_id === task_id)

  tasksTableSim.splice(taskIndex, 1)

  return task
}

function findTaskById(task_id: string) {
  return tasksTableSim.find((t) => t.task_id === task_id)
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

  commentsTableSim.push(newComment)

  return newComment
}

export async function listComments(
  task_id: string,
): Promise<CommentSchema[] | null> {
  return commentsTableSim.filter((c) => c.task_id === task_id)
}

export async function getCommentById(
  comment_id: string,
): Promise<CommentSchema> {
  const comment = findeCommentById(comment_id)
  if (!comment) throw new Error('Comment not found')
  return comment
}

export async function updateComment(
  comment_id: string,
  data: Partial<CreateUpdateCommentInput>,
): Promise<CommentSchema> {
  const comment = findeCommentById(comment_id)
  if (!comment) throw new Error('Comment not found')

  if (data.content) comment.content = data.content

  return comment
}

export async function deleteComment(
  comment_id: string,
): Promise<CommentSchema> {
  const comment = findeCommentById(comment_id)
  if (!comment) throw new Error('Comment not found')

  const commentIndex = commentsTableSim.findIndex(
    (c) => c.comment_id === comment_id,
  )

  commentsTableSim.splice(commentIndex, 1)

  return comment
}

function findeCommentById(comment_id: string) {
  return commentsTableSim.find((c) => c.comment_id === comment_id)
}
