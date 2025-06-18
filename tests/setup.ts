import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { userRoutes } from '../src/routes/user.routes'
import { authRoutes } from '../src/routes/auth.routes'
import { taskRoutes } from '../src/routes/task.routes'
import FastifyJwt from '@fastify/jwt'
import { env } from '../src/env'

export async function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  // Set up validator and serializer compilers
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // Register CORS
  app.register(fastifyCors, { origin: '*' })

  // Register Swagger for API documentation
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'task manager',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  // Register routes
  app.register(userRoutes, { prefix: '/api/v1' })
  app.register(authRoutes, { prefix: '/api/v1' })
  app.register(taskRoutes, { prefix: '/api/v1' })

  // Register JWT
  app.register(FastifyJwt, { secret: env.JWT_SECRET })

  // Add preHandler hook for JWT
  app.addHook('preHandler', (req, res, next) => {
    req.jwt = app.jwt
    return next()
  })

  return app
}
