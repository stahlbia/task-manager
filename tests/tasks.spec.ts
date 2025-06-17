import request from 'supertest'
import { describe, it, expect, beforeEach } from 'vitest'
import { buildApp } from './setup'
import { usersTableSim } from '../src/routes/users.routes'
import { tasksTableSim } from '../src/routes/tasks.routes'

describe('Task routes', () => {
  beforeEach(() => {
    usersTableSim.length = 0
    tasksTableSim.length = 0
  })

  async function createUser() {
    const app = await buildApp()
    const res = await request(app.server).post('/users').send({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '12345678',
    })
    return res.body.id
  }

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
