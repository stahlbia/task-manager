import z from 'zod'
import { FastifyTypeInstance } from '../utils/types'
import { randomUUID } from 'node:crypto'
import { taskSchema, TaskSchema } from '../schemas/tasks.schema'
import { usersTableSim } from './users.routes'
import { ensureAuthenticated } from '../middlewares/auth-middleware'

// Simulação do "banco" de tarefas
export const tasksTableSim: TaskSchema[] = []

export async function taskRoutes(app: FastifyTypeInstance) {
  // POST /tasks
  app.post(
    '/tasks',
    {
      schema: {
        tags: ['tasks'],
        description: 'Create a new task',
        body: taskSchema.omit({ task_id: true }),
        response: {
          201: taskSchema,
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (req, rep) => {
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
    },
  )

  // GET /tasks/:id
  app.get(
    '/tasks/:task_id',
    {
      schema: {
        tags: ['tasks'],
        description: 'Get a task by ID',
        params: z.object({ task_id: z.string().uuid() }),
        response: {
          200: taskSchema,
          404: z.object({ message: z.string() }),
        },
      },
      preHandler: ensureAuthenticated,
    },
    async (req, rep) => {
      const { task_id } = req.params
      const task = tasksTableSim.find((t) => t.task_id === task_id)

      if (!task) {
        return rep.status(404).send({ message: 'Task not found' })
      }

      return rep.send(task)
    },
  )

  // GET /tasks?assigned_to={user_id}
  app.get(
    '/tasks',
    {
      schema: {
        tags: ['tasks'],
        description: 'List tasks assigned to a user',
        querystring: z.object({ assigned_to: z.string() }),
        response: {
          200: z.array(taskSchema),
        },
      },
      preHandler: ensureAuthenticated,
    },
    (req) => {
      const { assigned_to } = req.query as { assigned_to: string }
      return tasksTableSim.filter((task) => task.assigned_to === assigned_to)
    },
  )

  // PUT /tasks/:task_id
  app.put(
    '/tasks/:task_id',
    {
      schema: {
        tags: ['tasks'],
        description: 'Update a task',
        params: z.object({ task_id: z.string().uuid() }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(['pending', 'in_progress', 'completed']).optional(),
        }),
        response: {
          200: taskSchema,
          404: z.object({ message: z.string() }),
        },
      },
      preHandler: ensureAuthenticated,
    },
    async (req, rep) => {
      const { task_id } = req.params as { task_id: string }
      const { title, description, status } = req.body

      const task = tasksTableSim.find((t) => t.task_id === task_id)
      if (!task) {
        return rep.status(404).send({ message: 'Task not found' })
      }

      if (title) task.title = title
      if (description) task.description = description
      if (status) task.status = status

      return rep.send(task)
    },
  )

  // DELETE /tasks/:task_id
  app.delete(
    '/tasks/:task_id',
    {
      schema: {
        tags: ['tasks'],
        description: 'Delete a task',
        params: z.object({ task_id: z.string() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
      preHandler: ensureAuthenticated,
    },
    async (req, rep) => {
      const { task_id } = req.params as { task_id: string }
      const taskIndex = tasksTableSim.findIndex((t) => t.task_id === task_id)

      if (taskIndex === -1) {
        return rep.status(404).send({ message: 'Task not found' })
      }

      tasksTableSim.splice(taskIndex, 1)
      return rep.status(204).send()
    },
  )
}
