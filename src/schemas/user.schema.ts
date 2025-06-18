/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod'

const required_name_error = 'Name is required'

export const completeUserSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string({ required_error: required_name_error }),
  email: z.string().email({ message: 'Invalid email address' }),
  password_hash: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  password_salt: z.string(),
  is_deleted: z.boolean().default(false),
  updated_at: z.date().default(new Date()),
  created_at: z.date().default(new Date()),
})

export type UserSchema = z.infer<typeof completeUserSchema>

export const userWithoutSensitiveInfoSchema = completeUserSchema.omit({
  password_hash: true,
  password_salt: true,
})

export type UserWithoutSensitiveInfoSchema = Omit<
  z.infer<typeof completeUserSchema>,
  'password_hash' | 'password_salt'
>

export const createUserSchema = z.object({
  name: z.string({ required_error: required_name_error }).trim().min(1),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const readUserSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string({ required_error: required_name_error }),
  email: z.string().email({ message: 'Invalid email address' }),
  is_deleted: z.boolean().default(false),
  updated_at: z.date().default(new Date()),
  created_at: z.date().default(new Date()),
})

export type ReadUser = z.infer<typeof readUserSchema>

export const updateUserSchema = z.object({
  name: z
    .string({ required_error: required_name_error })
    .trim()
    .min(1)
    .optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const userParamSchema = z.object({ user_id: z.string().uuid() })
export type UserParamsSchema = z.infer<typeof userParamSchema>
