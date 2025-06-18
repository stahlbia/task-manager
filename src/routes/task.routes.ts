import { FastifyTypeInstance } from '../utils/types.utils'
import { ensureAuthenticated } from '../middlewares/auth-handling.middleware'
import z from 'zod'
import {
  completeCommentSchema,
  completeTaskSchema,
  createTaskSchema,
  createUpdateCommentSchema,
  paramsCommentSchema,
  paramsTaskSchema,
  updateTaskSchema,
} from '../schemas/task.schema'
import {
  createCommentHandler,
  createTaskHandler,
  deleteCommentHandler,
  deleteTaskHandler,
  getCommentHandler,
  getTaskHandler,
  listCommentsHandler,
  listTasksHandler,
  updateCommentHandler,
  updateTaskHandler,
} from '../controllers/task.controller'

export async function taskRoutes(app: FastifyTypeInstance) {
  // --- Task CRUD API ---
  app.post(
    '/tasks',
    {
      schema: {
        tags: ['tasks'],
        description: 'Create a new task',
        body: createTaskSchema,
        response: {
          201: completeTaskSchema.describe('Created task'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    createTaskHandler,
  )

  app.get(
    // GET /tasks?assigned_to={user_id}
    '/tasks',
    {
      schema: {
        tags: ['tasks'],
        description: 'List tasks assigned to a user',
        querystring: z.object({ assigned_to: z.string() }),
        response: {
          200: z
            .array(completeTaskSchema)
            .describe('Get all tasks assigned to user'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    listTasksHandler,
  )

  app.get(
    // GET /tasks/:id
    '/tasks/:task_id',
    {
      schema: {
        tags: ['tasks'],
        description: 'Get a task by ID',
        params: paramsTaskSchema,
        response: {
          200: completeTaskSchema.describe('Get one task'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          404: z.object({ message: z.string() }).describe('Task not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    getTaskHandler,
  )

  app.put(
    // PUT /tasks/:task_id
    '/tasks/:task_id',
    {
      schema: {
        tags: ['tasks'],
        description: 'Update a task',
        params: paramsTaskSchema,
        body: updateTaskSchema,
        response: {
          200: completeTaskSchema.describe('Updated task'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          404: z.object({ message: z.string() }).describe('Task not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    updateTaskHandler,
  )

  app.delete(
    // DELETE /tasks/:task_id
    '/tasks/:task_id',
    {
      schema: {
        tags: ['tasks'],
        description: 'Delete a task',
        params: paramsTaskSchema,
        response: {
          200: z
            .object({ message: z.string() })
            .describe('Task deleted successfully'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          404: z.object({ message: z.string() }).describe('Task not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    deleteTaskHandler,
  )

  // --- Comment CRUD API --

  app.post(
    // POST /tasks/:task_id/comments
    '/tasks/:task_id/comments',
    {
      schema: {
        tags: ['comments'],
        description: 'Add a comment to a task',
        params: paramsCommentSchema,
        body: createUpdateCommentSchema,
        response: {
          201: completeCommentSchema.describe('Created comment'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    createCommentHandler,
  )

  app.get(
    // GET /tasks/:task_id/comments
    '/tasks/:task_id/comments',
    {
      schema: {
        tags: ['comments'],
        description: 'List all comments for a task',
        params: paramsCommentSchema,
        response: {
          200: z
            .array(completeCommentSchema)
            .describe('Get all comments in task'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    listCommentsHandler,
  )

  app.get(
    // GET /tasks/:task_id/comments/:comment_id
    '/tasks/:task_id/comments/:comment_id',
    {
      schema: {
        tags: ['comments'],
        description: 'List all comments for a task',
        params: paramsCommentSchema,
        response: {
          200: completeCommentSchema.describe('Get one comment'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          404: z.object({ message: z.string() }).describe('Comment not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    getCommentHandler,
  )

  app.put(
    // PUT /tasks/:task_id/comments/:comment_id
    '/tasks/:task_id/comments/:comment_id',
    {
      schema: {
        tags: ['comments'],
        description: 'Update a specific comment on a task',
        params: paramsCommentSchema,
        body: createUpdateCommentSchema,
        response: {
          200: completeCommentSchema.describe('Updated comment'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          404: z.object({ message: z.string() }).describe('Comment not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    updateCommentHandler,
  )

  app.delete(
    // DELETE /tasks/:task_id/comments/:comment_id
    '/tasks/:task_id/comments/:comment_id',
    {
      schema: {
        tags: ['comments'],
        description: 'Delete a specific comment on a task',
        params: paramsCommentSchema,
        response: {
          200: z.object({ message: z.string() }).describe('Delete comment'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          404: z.object({ message: z.string() }).describe('Comment not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    deleteCommentHandler,
  )
}
