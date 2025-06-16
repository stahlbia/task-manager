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
import { userRoutes } from './routes/users.routes'
import open from 'open'
import FastifyJwt from '@fastify/jwt'
import { authRoutes } from './routes/auth.routes'
import { taskRoutes } from './routes/tasks.routes'
import { env } from './env'
// import { errorHandling } from './middlewares/error-handling.middleware'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// seta o zod para validar de todos os dados de entrada
app.setValidatorCompiler(validatorCompiler)
// seta o zod para serializar todos os dados de saida
app.setSerializerCompiler(serializerCompiler)
// app.setErrorHandler(errorHandling)

// registra o pluging do cors e libera ele para todos os endpoints
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
