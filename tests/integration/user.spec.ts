import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { buildApp } from '../setup'
import * as userModel from '../../src/models/user.model'

let app: any

vi.mock('../../src/models/user.model')

describe('User Handlers (Integration Tests)', () => {
  beforeEach(async () => {
    app = await buildApp()
    vi.clearAllMocks()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const mockUser = {
        user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        name: 'Test User',
        email: 'test@example.com',
      }
      vi.spyOn(userModel, 'createUser').mockResolvedValue(mockUser)

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
      const body = JSON.parse(response.body)
      expect(body).toMatchObject(mockUser)
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
      const mockUsers = [
        {
          user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
          name: 'Test User 1',
          email: 'test1@example.com',
        },
        {
          user_id: 'de6887eb-bf61-4389-834a-e90747519876',
          name: 'Test User 2',
          email: 'test2@example.com',
        },
      ]
      vi.spyOn(userModel, 'listUsers').mockResolvedValue(mockUsers)

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/users',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toHaveLength(2)
      expect(body).toMatchObject(mockUsers)
      expect(userModel.listUsers).toHaveBeenCalled()
    })
  })

  describe('GET /users/:user_id', () => {
    it('should get a user by ID', async () => {
      const mockUser = {
        user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        name: 'Test User',
        email: 'test@example.com',
      }
      vi.spyOn(userModel, 'getUserById').mockResolvedValue(mockUser)

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/users/b38b27d7-96b3-4ee5-ba99-441f58011bd4',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toMatchObject(mockUser)
      expect(userModel.getUserById).toHaveBeenCalledWith(
        'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
      )
    })

    it('should return an error if the user is not found', async () => {
      vi.spyOn(userModel, 'getUserById').mockResolvedValue(null)

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/users/nonexistent',
      })

      expect(response.statusCode).toBe(404)
      const body = JSON.parse(response.body)
      expect(body.message).toBe('User not found')
    })
  })

  describe('PUT /users/:user_id', () => {
    it('should update a user', async () => {
      const mockUpdatedUser = {
        user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        name: 'Updated User',
        email: 'test@example.com',
      }
      vi.spyOn(userModel, 'updateUser').mockResolvedValue(mockUpdatedUser)

      const response = await app.inject({
        method: 'PUT',
        url: '/api/v1/users/b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        payload: { name: 'Updated User' },
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toMatchObject(mockUpdatedUser)
      expect(userModel.updateUser).toHaveBeenCalledWith(
        'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        {
          name: 'Updated User',
        },
      )
    })

    it('should return an error if the user is not found', async () => {
      vi.spyOn(userModel, 'updateUser').mockResolvedValue(null)

      const response = await app.inject({
        method: 'PUT',
        url: '/api/v1/users/nonexistent',
        payload: { name: 'Updated User' },
      })

      expect(response.statusCode).toBe(404)
      const body = JSON.parse(response.body)
      expect(body.message).toBe('User not found')
    })
  })

  describe('DELETE /users/:user_id', () => {
    it('should delete a user', async () => {
      const mockDeletedUser = {
        user_id: 'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
        name: 'Deleted User',
        email: 'test@example.com',
      }
      vi.spyOn(userModel, 'deleteUser').mockResolvedValue(mockDeletedUser)

      const response = await app.inject({
        method: 'DELETE',
        url: '/api/v1/users/b38b27d7-96b3-4ee5-ba99-441f58011bd4',
      })

      expect(response.statusCode).toBe(204)
      expect(userModel.deleteUser).toHaveBeenCalledWith(
        'b38b27d7-96b3-4ee5-ba99-441f58011bd4',
      )
    })

    it('should return an error if the user is not found', async () => {
      vi.spyOn(userModel, 'deleteUser').mockResolvedValue(null)

      const response = await app.inject({
        method: 'DELETE',
        url: '/api/v1/users/nonexistent',
      })

      expect(response.statusCode).toBe(404)
      const body = JSON.parse(response.body)
      expect(body.message).toBe('User not found')
    })
  })
})
