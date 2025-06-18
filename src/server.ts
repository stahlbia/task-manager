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
// import { knex } from './database'

import { userRoutes } from './routes/user.routes'
import open from 'open'
import FastifyJwt from '@fastify/jwt'
import { authRoutes } from './routes/auth.routes'
import { taskRoutes } from './routes/task.routes'
import { env } from './env'
// import { errorHandling } from './middlewares/error-handling.middleware'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
// app.setErrorHandler(errorHandling)

app.register(fastifyCors, { origin: '*' })

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

app.register(userRoutes, { prefix: '/api/v1' })
app.register(authRoutes, { prefix: '/api/v1' })
app.register(taskRoutes, { prefix: '/api/v1' })

// jwt
app.register(FastifyJwt, { secret: env.JWT_SECRET })

app.addHook('preHandler', (req, res, next) => {
  req.jwt = app.jwt
  return next()
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
  open('http://localhost:3333/docs')
})
