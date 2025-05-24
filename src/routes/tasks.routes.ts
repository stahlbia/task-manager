import z from 'zod';
import { FastifyTypeInstance } from '../utils/types';
import { randomUUID } from 'node:crypto';
import { taskSchema, TaskInput } from '../schemas/task.schema';
import { usersTableSim } from './user.routes';

// Simulação do "banco" de tarefas
export const tasksTableSim: TaskInput[] = [];

export async function taskRoutes(app: FastifyTypeInstance) {
  // POST /tasks
  app.post('/tasks', {
    schema: {
      tags: ['tasks'],
      description: 'Create a new task',
      body: taskSchema.omit({ id: true }),
      response: {
        201: taskSchema,
        400: z.object({ message: z.string() }),
      }
    }
  }, (req, rep) => {
    const { title, description, status, assignedTo } = req.body;

    const userExists = usersTableSim.find(u => u.id === assignedTo && !u.deleted);
    if (!userExists) {
      return rep.status(400).send({ message: 'Assigned user not found' });
    }

    const task: TaskInput = {
      id: randomUUID(),
      title,
      description,
      status,
      assignedTo,
    };

    tasksTableSim.push(task);
    return rep.status(201).send(task);
  });

  // GET /tasks/:id
  app.get('/tasks/:id', {
    schema: {
      tags: ['tasks'],
      description: 'Get a task by ID',
      params: z.object({ id: z.string() }),
      response: {
        200: taskSchema,
        404: z.object({ message: z.string() }),
      }
    }
  }, (req, rep) => {
    const { id } = req.params as { id: string };
    const task = tasksTableSim.find(t => t.id === id);

    if (!task) {
      return rep.status(404).send({ message: 'Task not found' });
    }

    return rep.send(task);
  });

  // GET /tasks?assignedTo={userId}
  app.get('/tasks', {
    schema: {
      tags: ['tasks'],
      description: 'List tasks assigned to a user',
      querystring: z.object({ assignedTo: z.string() }),
      response: {
        200: z.array(taskSchema),
      }
    }
  }, (req) => {
    const { assignedTo } = req.query as { assignedTo: string };
    return tasksTableSim.filter(task => task.assignedTo === assignedTo);
  });

  // PUT /tasks/:id
  app.put('/tasks/:id', {
    schema: {
      tags: ['tasks'],
      description: 'Update a task',
      params: z.object({ id: z.string() }),
      body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['pending', 'in_progress', 'completed']).optional(),
      }),
      response: {
        200: taskSchema,
        404: z.object({ message: z.string() }),
      }
    }
  }, (req, rep) => {
    const { id } = req.params as { id: string };
    const { title, description, status } = req.body;

    const task = tasksTableSim.find(t => t.id === id);
    if (!task) {
      return rep.status(404).send({ message: 'Task not found' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;

    return rep.send(task);
  });

  // DELETE /tasks/:id
  app.delete('/tasks/:id', {
    schema: {
      tags: ['tasks'],
      description: 'Delete a task',
      params: z.object({ id: z.string() }),
      response: {
        204: z.null(),
        404: z.object({ message: z.string() }),
      }
    }
  }, (req, rep) => {
    const { id } = req.params as { id: string };
    const taskIndex = tasksTableSim.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return rep.status(404).send({ message: 'Task not found' });
    }

    tasksTableSim.splice(taskIndex, 1);
    return rep.status(204).send();
  });
}
