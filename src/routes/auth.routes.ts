import { FastifyTypeInstance } from '../utils/types'
import {
  loginSchema,
  loginResponseSchema,
  logoutSchema,
} from '../schemas/auth.schema'
import { loginHandler, logoutHandler } from '../controllers/auth.controller'
import z from 'zod'
import { ensureAuthenticated } from '../middlewares/auth-handling.middleware'

export async function authRoutes(app: FastifyTypeInstance) {
  app.post(
    '/login',
    {
      schema: {
        tags: ['auth'],
        description: 'Login into the API',
        body: loginSchema,
        response: {
          201: loginResponseSchema,
          401: z.object({ message: z.string() }),
        },
      },
    },
    loginHandler,
  )
  app.post(
    '/logout',
    {
      schema: {
        tags: ['auth'],
        description: 'Logout from the API',
        body: logoutSchema,
        response: {
          201: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
        },
      },
      preHandler: ensureAuthenticated,
    },
    logoutHandler,
  )
}
