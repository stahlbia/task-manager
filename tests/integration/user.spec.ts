import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { buildApp } from '../setup'
import * as userModel from '../../src/models/user.model'
import { FastifyInstance } from 'fastify'
import { mockPayload, mockUser1, mockUser2, simulateAuth } from './test.utils'

vi.mock('../../src/models/user.model')
vi.mock('../../src/plugins/send-notification.plugin')

describe('User Handlers (Integration Tests)', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildApp()
    vi.clearAllMocks()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('POST /users', () => {
    it('should create a new user', async () => {
      vi.spyOn(userModel, 'createUser').mockResolvedValue(mockUser1)

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      })
      expect(response.statusCode).toBe(201)
      expect(response.body).toMatch(JSON.stringify(mockUser1))
      expect(userModel.createUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should return an error if the user already exists', async () => {
      vi.spyOn(userModel, 'createUser').mockRejectedValue(
        new Error('User already exists'),
      )

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      })

      expect(response.statusCode).toBe(409)
      const body = JSON.parse(response.body)
      expect(body.message).toBe('User already exists')
    })
  })

  describe('GET /users', () => {
    it('should list all users', async () => {
      const mockUsers = [mockUser1, mockUser2]
      vi.spyOn(userModel, 'listUsers').mockResolvedValue(mockUsers)

      const accessToken = await simulateAuth(app, mockUser1, mockPayload)

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/users',
        headers: { authorization: accessToken },
      })

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatch(JSON.stringify(mockUser1))
      expect(userModel.listUsers).toHaveBeenCalled()
    })
  })

  describe('GET /users/:user_id', () => {
    it('should get a user by ID', async () => {
      vi.spyOn(userModel, 'getUserById').mockResolvedValue(mockUser1)

      const accessToken = await simulateAuth(app, mockUser1, mockPayload)

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/users/${mockUser1.user_id}`,
        headers: { authorization: accessToken },
      })

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatch(JSON.stringify(mockUser1))
    })

    it('should return an error if the user is not found', async () => {
      vi.spyOn(userModel, 'getUserById').mockResolvedValue(mockUser1)

      const accessToken = await simulateAuth(app, mockUser1, mockPayload)

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/users/nonexistent',
        headers: { authorization: accessToken },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('PUT /users/:user_id', () => {
    it('should update a user', async () => {
      vi.spyOn(userModel, 'updateUser').mockResolvedValue(mockUser1)

      const accessToken = await simulateAuth(app, mockUser1, mockPayload)

      const response = await app.inject({
        method: 'PUT',
        url: `/api/v1/users/${mockUser1.user_id}`,
        payload: { name: 'Updated User' },
        headers: { authorization: accessToken },
      })

      expect(response.statusCode).toBe(200)
    })

    it('should return an error if the user is not found', async () => {
      vi.spyOn(userModel, 'updateUser').mockResolvedValue(mockUser1)

      const accessToken = await simulateAuth(app, mockUser1, mockPayload)

      const response = await app.inject({
        method: 'PUT',
        url: '/api/v1/users/nonexistent',
        payload: { name: 'Updated User' },
        headers: { authorization: accessToken },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('DELETE /users/:user_id', () => {
    it('should delete a user', async () => {
      vi.spyOn(userModel, 'deleteUser').mockResolvedValue(mockUser1)

      const accessToken = await simulateAuth(app, mockUser1, mockPayload)

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/users/${mockUser2.user_id}`,
        headers: { authorization: accessToken },
      })

      expect(response.statusCode).toBe(204)
    })

    it('should return an error if the user is not found', async () => {
      vi.spyOn(userModel, 'deleteUser').mockResolvedValue(mockUser1)

      const accessToken = await simulateAuth(app, mockUser1, mockPayload)

      const response = await app.inject({
        method: 'DELETE',
        url: '/api/v1/users/nonexistent',
        headers: { authorization: accessToken },
      })

      expect(response.statusCode).toBe(400)
    })
  })
})
