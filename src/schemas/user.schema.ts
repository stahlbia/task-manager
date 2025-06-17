import { z } from 'zod'

const required_name_error = 'Name is required'

export const userSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string({ required_error: required_name_error }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  is_deleted: z.boolean().default(false),
  created_at: z.date(),
})

export type UserSchema = z.infer<typeof userSchema>

export const createUserSchema = z.object({
  name: z.string({ required_error: required_name_error }).trim().min(1),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

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
