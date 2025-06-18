import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { buildApp } from '../setup'
import * as taskModel from '../../src/models/task.model'
import * as userModel from '../../src/models/user.model'
import { FastifyInstance } from 'fastify'
import {
  mockPayload,
  mockTask1,
  mockUser1,
  mockUser2,
  simulateAuth,
} from './test.utils'

vi.mock('../../src/models/user.model')
vi.mock('../../src/plugins/send-notification.plugin')

describe('Task routes', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildApp()
    vi.clearAllMocks()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('POST /tasks', () => {
    it('should return 201 for create a task being authenticated', async () => {
      vi.spyOn(userModel, 'createUser').mockResolvedValue(mockUser1)
      vi.spyOn(userModel, 'getUserById')
      vi.spyOn(taskModel, 'createTask').mockResolvedValue(mockTask1)

      const accessToken = await simulateAuth(app, mockUser1, mockPayload)

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/tasks',
        body: { title: mockTask1.title, description: mockTask1.description },
        headers: { authorization: accessToken },
      })

      expect(response.statusCode).toBe(201)
    })

    it('should return 401 for create a task being unauthenticated', () => {})
  })

  describe('GET /tasks?assigned_to={user_id}', () => {
    it('should return 200 to read a tasks beign authenticated', () => {})

    it('should return 401 to read tasks beign unauthenticates', () => {})
  })

  describe('GET /tasks/:id', () => {
    it('should return 200 to read one task beign authenticated', () => {})

    it('should return 401 to read tasks beign unauthenticated', () => {})
  })

  describe('PUT /tasks/:task_id', () => {
    it('should return 200 to update one task beign authenticated', () => {})

    it('should return 401 to update tasks beign unauthenticated', () => {})
  })

  describe('DELETE /tasks/:task_id', () => {
    it('should return 200 to delete one task beign authenticated', () => {})

    it('should return 401 to delete tasks beign unauthenticated', () => {})
  })

  it('cria uma nova tarefa', async () => {
    const app = await buildApp()
    const userId = await createUser()

    const res = await request(app.server).post('/tasks').send({
      title: 'Tarefa 1',
      description: 'Descrição',
      status: 'pending',
      assignedTo: userId,
    })

    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Tarefa 1')
  })

  it('atualiza uma tarefa existente', async () => {
    const app = await buildApp()
    const userId = await createUser()

    const create = await request(app.server).post('/tasks').send({
      title: 'Tarefa 2',
      description: 'Desc',
      status: 'pending',
      assignedTo: userId,
    })

    const taskId = create.body.id

    const update = await request(app.server).put(`/tasks/${taskId}`).send({
      status: 'completed',
    })

    expect(update.status).toBe(200)
    expect(update.body.status).toBe('completed')
  })

  it('lista tarefas de um usuário', async () => {
    const app = await buildApp()
    const userId = await createUser()

    await request(app.server).post('/tasks').send({
      title: 'Tarefa A',
      description: 'Desc',
      status: 'pending',
      assignedTo: userId,
    })

    const res = await request(app.server)
      .get(`/tasks`)
      .query({ assignedTo: userId })

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })

  it('deleta uma tarefa', async () => {
    const app = await buildApp()
    const userId = await createUser()

    const res = await request(app.server).post('/tasks').send({
      title: 'Para excluir',
      description: 'Desc',
      status: 'pending',
      assignedTo: userId,
    })

    const taskId = res.body.id

    const del = await request(app.server).delete(`/tasks/${taskId}`)
    expect(del.status).toBe(204)
  })
})
