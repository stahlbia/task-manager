import { z } from 'zod'

export const taskSchema = z.object({
  task_id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  assigned_to: z.string().uuid().optional(),
})

export type TaskSchema = z.infer<typeof taskSchema>

export const createTaskSchema = taskSchema.omit({ task_id: true })

export type CreateTaskInput = z.infer<typeof createTaskSchema>
