import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { routes } from './routes/users.routes';
import open from 'open';

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

app.register(routes)

app.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running!')
    open('http://localhost:3333/docs')
})
