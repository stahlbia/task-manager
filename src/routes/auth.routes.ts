import z from 'zod';
import { FastifyTypeInstance } from "../utils/types";
import { loginSchema, loginResponseSchema, LoginInput } from "../schemas/auth.schema";
import { loginHandler } from '../controllers/auth.controller';

// simulacao do banco
const authTokens: LoginInput[] = [];

export async function authRoutes(app: FastifyTypeInstance) {
    app.post('/login', {
        schema: {
            tags: ['auth'],
            description: 'Login into the api',
            body: loginSchema,
            response: {
                201: loginResponseSchema,
            },
        },
    }, loginHandler);
}