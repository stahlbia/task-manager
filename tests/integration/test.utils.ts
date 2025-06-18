import { FastifyInstance } from 'fastify'
import { UserWithoutSensitiveInfoSchema } from '../../src/schemas/user.schema'
import { TokenPayload } from '../../src/schemas/auth.schema'

import * as authModel from '../../src/models/auth.model'
import { TaskSchema } from '../../src/schemas/task.schema'

export const mockUser1: UserWithoutSensitiveInfoSchema = {
  user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
  name: 'Test User 1',
  email: 'test1@example.com',
  is_deleted: false,
  updated_at: new Date(),
  created_at: new Date(),
}

export const mockUser2: UserWithoutSensitiveInfoSchema = {
  user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
  name: 'Test User 2',
  email: 'test2@example.com',
  is_deleted: false,
  updated_at: new Date(),
  created_at: new Date(),
}

export const mockPayload = {
  user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
  expiresIn: '10min',
}

export async function simulateAuth(
  app: FastifyInstance,
  mockUser: UserWithoutSensitiveInfoSchema,
  mockPayload: TokenPayload,
) {
  vi.spyOn(authModel, 'login').mockResolvedValue({
    payload: mockPayload,
    user: mockUser,
  })

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/login',
    payload: {
      email: 'test@example.com',
      password: 'password123',
    },
  })
  expect(response.statusCode).toBe(201)
  return response.json().accessToken
}

export const mockTask1: TaskSchema = {
  task_id: '8df23ea6-da93-4674-b22e-9a1b73d4bf4b',
  title: 'Task 1',
  description: '.....',
  status: 'pending',
  created_by: mockUser1.user_id,
  assigned_to: mockUser1.user_id,
  updated_at: new Date(),
  created_at: new Date(),
}

export const mockTask2: TaskSchema = {
  task_id: '521a2dda-9309-4aad-b2e8-89edfc147ec1',
  title: 'Task 2',
  description: '.....',
  status: 'in_progress',
  created_by: mockUser1.user_id,
  assigned_to: mockUser1.user_id,
  updated_at: new Date(),
  created_at: new Date(),
}
