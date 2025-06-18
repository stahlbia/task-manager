import { z } from 'zod'
import { userWithoutSensitiveInfoSchema } from './user.schema'

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string().min(8),
})

export type LoginInput = z.infer<typeof loginSchema>

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: userWithoutSensitiveInfoSchema,
})

export type LoginResponse = z.infer<typeof loginResponseSchema>

export const tokenPayload = z.object({
  user_id: z.string().uuid(),
  expiresIn: z.string(),
})

export type TokenPayload = z.infer<typeof tokenPayload>
