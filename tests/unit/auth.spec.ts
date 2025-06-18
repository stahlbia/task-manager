import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FastifyRequest, FastifyReply } from 'fastify'
import * as userModel from '../../src/models/user.model'
import * as notificationMiddleware from '../../src/plugins/send-notification.plugin'
import * as errorHandlingMiddleware from '../../src/middlewares/error-handling.middleware'
import {
  createUserHandler,
  listUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../../src/controllers/user.controller'

vi.mock('../../src/models/user.model')
vi.mock('../../src/middlewares/send-notification.middleware')
vi.mock('../../src/middlewares/error-handling.middleware')

describe('User Handlers (Unit Tests)', () => {
  const mockReply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  } as Partial<FastifyReply>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createUserHandler', () => {
    it('should create a user and send a notification', async () => {
      const mockRequest = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      } as unknown as FastifyRequest

      const mockUser = {
        user_id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
      }
      vi.spyOn(userModel, 'createUser').mockResolvedValue(mockUser)

      await createUserHandler(mockRequest, mockReply)

      expect(userModel.createUser).toHaveBeenCalledWith(mockRequest.body)
      expect(notificationMiddleware.sendNotification).toHaveBeenCalledWith(
        'test@example.com',
        'user_created',
        { user_name: 'Test User' },
      )
      expect(mockReply.status).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith(mockUser)
    })

    it('should handle errors and send error response', async () => {
      const mockRequest = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      } as unknown as FastifyRequest

      const mockError = new Error('Database error')
      vi.spyOn(userModel, 'createUser').mockRejectedValue(mockError)
      const treatedError = { status: 500, message: 'Internal Server Error' }
      vi.spyOn(errorHandlingMiddleware, 'errorHandler').mockReturnValue(
        treatedError,
      )

      await createUserHandler(mockRequest, mockReply)

      expect(errorHandlingMiddleware.errorHandler).toHaveBeenCalledWith(
        mockError,
      )
      expect(mockReply.status).toHaveBeenCalledWith(500)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      })
    })
  })

  describe('listUsersHandler', () => {
    it('should list all users', async () => {
      const mockRequest = {} as unknown as FastifyRequest

      const mockUsers = [
        { user_id: 'user123', name: 'Test User', email: 'test@example.com' },
      ]
      vi.spyOn(userModel, 'listUsers').mockResolvedValue(mockUsers)

      await listUsersHandler(mockRequest, mockReply)

      expect(userModel.listUsers).toHaveBeenCalled()
      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith(mockUsers)
    })
  })

  describe('getUserHandler', () => {
    it('should get a user by ID', async () => {
      const mockRequest = {
        params: { user_id: 'user123' },
      } as unknown as FastifyRequest

      const mockUser = {
        user_id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
      }
      vi.spyOn(userModel, 'getUserById').mockResolvedValue(mockUser)

      await getUserHandler(mockRequest, mockReply)

      expect(userModel.getUserById).toHaveBeenCalledWith('user123')
      expect(mockReply.status).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith(mockUser)
    })
  })

  describe('updateUserHandler', () => {
    it('should update a user and send a notification', async () => {
      const mockRequest = {
        params: { user_id: 'user123' },
        body: { name: 'Updated User' },
      } as unknown as FastifyRequest

      const mockUpdatedUser = {
        user_id: 'user123',
        name: 'Updated User',
        email: 'test@example.com',
      }
      vi.spyOn(userModel, 'updateUser').mockResolvedValue(mockUpdatedUser)

      await updateUserHandler(mockRequest, mockReply)

      expect(userModel.updateUser).toHaveBeenCalledWith('user123', {
        name: 'Updated User',
      })
      expect(notificationMiddleware.sendNotification).toHaveBeenCalledWith(
        'test@example.com',
        'user_update',
      )
      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith(mockUpdatedUser)
    })
  })

  describe('deleteUserHandler', () => {
    it('should delete a user and send a notification', async () => {
      const mockRequest = {
        params: { user_id: 'user123' },
      } as unknown as FastifyRequest

      const mockDeletedUser = {
        user_id: 'user123',
        name: 'Deleted User',
        email: 'test@example.com',
      }
      vi.spyOn(userModel, 'deleteUser').mockResolvedValue(mockDeletedUser)

      await deleteUserHandler(mockRequest, mockReply)

      expect(userModel.deleteUser).toHaveBeenCalledWith('user123')
      expect(notificationMiddleware.sendNotification).toHaveBeenCalledWith(
        'test@example.com',
        'user_delete',
      )
      expect(mockReply.status).toHaveBeenCalledWith(204)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'User deleted successfully!',
      })
    })
  })
})
