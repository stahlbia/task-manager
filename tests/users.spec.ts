import request from 'supertest'
import { describe, it, expect, beforeEach } from 'vitest'
import { buildApp } from './setup'
import { usersTableSim } from '../src/routes/users.routes'

describe('User routes', () => {
  beforeEach(() => {
    usersTableSim.length = 0 // limpa a "tabela"
  })

  it('cria um novo usuário', async () => {
    const app = await buildApp()

    const res = await request(app.server).post('/users').send({
      name: 'Gabriela',
      email: 'gabriela@gmail.com',
      password: '12345678',
    })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
  })

  it('retorna erro se o e-mail já existe', async () => {
    const app = await buildApp()

    await request(app.server).post('/users').send({
      name: 'Emanuele',
      email: 'emanu@email.com',
      password: '12345678',
    })

    const res = await request(app.server).post('/users').send({
      name: 'Emanuele 2',
      email: 'emanu@email.com',
      password: '12345678',
    })

    expect(res.status).toBe(401)
  })

  it('lista todos os usuários', async () => {
    const app = await buildApp()

    await request(app.server).post('/users').send({
      name: 'Ana Beatriz',
      email: 'bia@email.com',
      password: '12345678',
    })

    const res = await request(app.server).get('/users')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })
})
