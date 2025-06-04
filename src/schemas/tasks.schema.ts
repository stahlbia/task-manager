import { z } from 'zod';

export const taskSchema = z.object({
  task_id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  assignedTo: z.string(),
});

export type TaskInput = z.infer<typeof taskSchema>;
