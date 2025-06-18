import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { buildApp } from '../setup'
import * as authModel from '../../src/models/auth.model'
import { login, logout, isTokenBlacklisted } from '../../src/models/auth.model'
import { UserWithoutSensitiveInfoSchema } from '../../src/schemas/user.schema'
import { FastifyInstance } from 'fastify'
import { loginHandler } from '../../src/controllers/auth.controller'

vi.mock('../../src/models/user.model')

const mockJwt = {
  sign: vi.fn(),
  verify: vi.fn(),
}

mockJwt.sign.mockReturnValue('mocked.jwt.token')

function simulateAuth(tokenPayload: object) {
  const token = 'mocked.jwt.token'
  mockJwt.sign.mockReturnValue(token)
  mockJwt.verify.mockReturnValue(tokenPayload)
  return token
}

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
    it('should be able to login with known user', async () => {
      const mockUser: UserWithoutSensitiveInfoSchema = {
        user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        name: 'Test User 1',
        email: 'test@example.com',
        is_deleted: false,
        updated_at: new Date(),
        created_at: new Date(),
      }
      const mockPayload = {
        user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        expiresIn: '10min',
      }
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
    })

    it('should not be able to login with unknown user', async () => {
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
    it('should be able to logout when there is a user logged in', async () => {
      const mockUser: UserWithoutSensitiveInfoSchema = {
        user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        name: 'Test User 1',
        email: 'test@example.com',
        is_deleted: false,
        updated_at: new Date(),
        created_at: new Date(),
      }
      const mockPayload = {
        user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        expiresIn: '10min',
      }
      vi.spyOn(authModel, 'login').mockResolvedValue({
        payload: mockPayload,
        user: mockUser,
      })
      vi.spyOn(authModel, 'logout').mockResolvedValue()

      const responseLogin = await app.inject({
        method: 'POST',
        url: '/api/v1/login',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      })

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/logout',
        headers: { authorization: responseLogin.accessToken },
      })
      console.log(response)
      expect(response.statusCode).toBe(201)
    })

    it('should not be able to logout when there isn`t a user logged in', async () => {})
  })
})
