import { z } from 'zod'

// Enum for task status
export const taskStatus = z.enum(['pending', 'in_progress', 'completed'])
// export task status
export type TaskStatus = z.infer<typeof taskStatus>

// Schema for a task
export const completeTaskSchema = z.object({
  task_id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  status: taskStatus,
  created_by: z.string().uuid(),
  assigned_to: z.string().uuid(),
  updated_at: z.date().default(new Date()),
  created_at: z.date().default(new Date()),
})

export type TaskSchema = z.infer<typeof completeTaskSchema>

// Schema to create a task
export const createTaskSchema = completeTaskSchema.omit({
  task_id: true,
  status: true,
  created_by: true,
  assigned_to: true,
  updated_at: true,
  created_at: true,
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>

// Schema to update a task
export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: taskStatus.optional(),
  assigned_to: z.string().uuid().optional(),
})

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

// Schema to a task params
export const paramsTaskSchema = z.object({ task_id: z.string().uuid() })
export type ParamsTaskSchema = z.infer<typeof paramsTaskSchema>

// Schema for a comment
export const completeCommentSchema = z.object({
  comment_id: z.string().uuid(),
  content: z.string(),
  updated_at: z.date().default(new Date()),
  created_at: z.date().default(new Date()),
  task_id: z.string().uuid(),
  user_id: z.string().uuid(),
})

export type CommentSchema = z.infer<typeof completeCommentSchema>

// Schema to create/update a comment
export const createUpdateCommentSchema = z.object({
  content: z.string(),
})

export type CreateUpdateCommentInput = z.infer<typeof createUpdateCommentSchema>

// Schema to a comment params
export const paramsCommentSchema = z.object({
  task_id: z.string().uuid(),
  comment_id: z.string().uuid(),
})
export type ParamsCommentSchema = z.infer<typeof paramsCommentSchema>
