import { FastifyTypeInstance } from '../utils/types.utils'
import { loginSchema, loginResponseSchema } from '../schemas/auth.schema'
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
          201: loginResponseSchema.describe('Get login credentials'),
          401: z.object({ message: z.string() }).describe('Unauthorized'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
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
        response: {
          201: z.object({ message: z.string() }).describe('Logout information'),
          400: z.object({ message: z.string() }).describe('User not logged in'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
      preHandler: ensureAuthenticated,
    },
    logoutHandler,
  )
}
