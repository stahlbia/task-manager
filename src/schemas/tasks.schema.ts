import { z } from 'zod'

// Enum para o status da tarefa, para ser reutilizado
const taskStatusEnum = z.enum(['pending', 'in_progress', 'completed'])

// Exporta o tipo 'TaskStatus' para ser usado no controller
export type TaskStatus = z.infer<typeof taskStatusEnum>

// Schema principal para uma Tarefa (Task)
export const taskSchema = z.object({
  task_id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  status: taskStatusEnum,
  assigned_to: z.string().uuid(), // CORREÇÃO: Removido o .optional() pois a criação de uma tarefa exige um responsável.
})

// Schema para um Comentário (Comment) - Estava faltando
export const commentSchema = z.object({
  comment_id: z.string().uuid(),
  task_id: z.string().uuid(),
  user_id: z.string().uuid(),
  comment: z.string(),
  created_at: z.date(),
})

// Tipos inferidos a partir dos schemas para uso no seu código
export type TaskSchema = z.infer<typeof taskSchema>
export type CommentSchema = z.infer<typeof commentSchema>

// Schema para a criação de uma nova tarefa (omitindo o ID que é gerado pelo sistema)
export const createTaskSchema = taskSchema.omit({ task_id: true })
export type CreateTaskInput = z.infer<typeof createTaskSchema>
