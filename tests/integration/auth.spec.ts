import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { buildApp } from '../setup'
import * as authModel from '../../src/models/auth.model'
import { FastifyInstance } from 'fastify'
import { mockPayload, mockUser1, simulateAuth } from './test.utils'

vi.mock('../../src/models/user.model')

describe('Auth Routes (Integration Tests)', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildApp()
    vi.clearAllMocks()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('POST /login', () => {
    it('should return 201 when known user logs in', async () => {
      await simulateAuth(app, mockUser1, mockPayload)

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/login',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      })

      expect(response.statusCode).toBe(201)
    })

    it('should return 409 when unknown user logs in', async () => {
      vi.spyOn(authModel, 'login').mockRejectedValue(
        Error('Invalid credentials'),
      )

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/login',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      })
      expect(response.statusCode).toBe(409)
    })
  })

  describe('POST /logout', () => {
    it('should return 201 when a user is logginout', async () => {
      const accessToken = await simulateAuth(app, mockUser1, mockPayload)

      vi.spyOn(authModel, 'logout').mockResolvedValue()

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/logout',
        headers: { authorization: accessToken },
      })

      expect(response.statusCode).toBe(201)
    })

    it('should return 401 when a user loggedout not being loggedin', async () => {
      vi.spyOn(authModel, 'logout').mockResolvedValue()

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/logout',
        headers: { authorization: 'my-fake-token' },
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
