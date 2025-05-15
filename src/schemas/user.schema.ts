import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export type UserInput = z.infer<typeof userSchema>; // <- evita duplicar interface