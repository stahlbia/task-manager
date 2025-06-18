import { tasksTableSim } from '../routes/tasks.routes'
import { TaskSchema } from '../schemas/tasks.schema'
import { randomUUID } from 'crypto'

export class TaskService {
  static async createTask(
    data: Omit<TaskSchema, 'task_id'>,
  ): Promise<TaskSchema> {
    const newTask: TaskSchema = {
      task_id: randomUUID(),
      ...data,
    }

    tasksTableSim.push(newTask)
    return newTask
  }

  static async getTaskById(task_id: string): Promise<TaskSchema | null> {
    return tasksTableSim.find((task) => task.task_id === task_id) || null
  }

  static async listTasks(assigned_to?: string): Promise<TaskSchema[]> {
    if (assigned_to) {
      return tasksTableSim.filter((task) => task.assigned_to === assigned_to)
    }
    return tasksTableSim
  }

  static async updateTask(
    task_id: string,
    updates: Partial<TaskSchema>,
  ): Promise<TaskSchema | null> {
    const task = tasksTableSim.find((t) => t.task_id === task_id)
    if (!task) {
      return null
    }

    Object.assign(task, updates)
    return task
  }
}
