import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { userRoutes } from './routes/users.routes'
import open from 'open'
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import { authRoutes } from './routes/auth.routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// seta o zod para validar de todos os dados de entrada
app.setValidatorCompiler(validatorCompiler)
// seta o zod para serializar todos os dados de saida
app.setSerializerCompiler(serializerCompiler)


// registra o pluging do cors e libera ele para todos os endpoints
app.register(fastifyCors, { origin: '*' })

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'task manager',
            version: '1.0.0',
        }
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.register(userRoutes, { prefix: '/api/v1' })
app.register(authRoutes, { prefix: '/api/v1' })

// jwt
app.register(fjwt, { secret: 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' })

app.addHook('preHandler', (req, res, next) => {
  // here we are
  req.jwt = app.jwt
  return next()
})

// cookies
app.register(fCookie, {
  secret: 'some-secret-key',
  hook: 'preHandler',
})

app.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running!')
    open('http://localhost:3333/docs')
})
