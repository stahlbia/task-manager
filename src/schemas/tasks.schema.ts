import { z } from 'zod';

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  assignedTo: z.string(),
});

export type TaskInput = z.infer<typeof taskSchema>;
