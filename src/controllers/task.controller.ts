// src/controllers/task.controller.ts

import { FastifyRequest, FastifyReply } from 'fastify'
import { randomUUID } from 'node:crypto'
import { TaskSchema, TaskStatus } from '../schemas/tasks.schema'
// CORREÇÃO: Importando as tabelas da nova fonte central de dados.
import { usersTableSim, tasksTableSim } from '../db/dbSimulator'

// Tipos para os corpos e parâmetros (sem alterações aqui)
interface CreateTaskBody {
  title: string
  description: string
  status: TaskStatus
  assigned_to: string
}
interface UpdateTaskBody {
  title?: string
  description?: string
  status?: TaskStatus
}
interface CommentBody {
  comment: string
}
interface UserPayload {
  user_id: string
}
interface TaskParams {
  task_id: string
}
interface CommentParams extends TaskParams {
  comment_id: string
}

// --- Task Handlers (O código dos handlers permanece o mesmo) ---

export async function createTaskHandler(
  req: FastifyRequest<{ Body: CreateTaskBody }>,
  rep: FastifyReply,
) {
  const { title, description, status, assigned_to } = req.body

  const userExists = usersTableSim.find(
    (u) => u.user_id === assigned_to && !u.is_deleted,
  )
  if (!userExists) {
    return rep.status(400).send({ message: 'Assigned user not found' })
  }

  const task: TaskSchema = {
    task_id: randomUUID(),
    title,
    description,
    status,
    assigned_to,
  }

  tasksTableSim.push(task)
  return rep.status(201).send(task)
}

// ... todos os seus outros handlers (get, update, delete, etc.) continuam aqui ...
export async function deleteTaskHandler(
  req: FastifyRequest<{ Params: TaskParams }>,
  rep: FastifyReply,
) {
  const { task_id } = req.params
  const taskIndex = tasksTableSim.findIndex((t) => t.task_id === task_id)

  if (taskIndex === -1) {
    return rep.status(404).send({ message: 'Task not found' })
  }

  tasksTableSim.splice(taskIndex, 1)
  return rep.status(204).send()
}

// ... etc. para todos os outros handlers ...
