import { z } from 'zod';

export const userSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string({ required_error: 'Name is required'}),
  email: z.string().email({ message: 'Invalid email address'}),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long'}),
  is_deleted: z.boolean(),
});

export type UserInput = z.infer<typeof userSchema>; // <- evita duplicar interface