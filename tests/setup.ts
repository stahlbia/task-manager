import fastify from 'fastify'
import { userRoutes } from '../src/routes/users.routes'
import { taskRoutes } from '../src/routes/tasks.routes'

export async function buildApp() {
  const app = fastify()
  await app.register(userRoutes)
  await app.register(taskRoutes)
  await app.ready()
  return app
}
