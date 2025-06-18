import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FastifyRequest, FastifyReply } from 'fastify'
import * as taskModel from '../../src/models/task.model'
import * as notificationMiddleware from '../../src/plugins/send-notification.plugin'
import * as errorHandlingMiddleware from '../../src/middlewares/error-handling.middleware'
import {
  createTaskHandler,
  listTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from '../../src/controllers/task.controller'

vi.mock('../../src/models/task.model')
vi.mock('../../src/middlewares/send-notification.middleware')
vi.mock('../../src/middlewares/error-handling.middleware')

describe('Task Handlers (Unit Tests)', () => {
  const mockReply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  } as Partial<FastifyReply>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createTaskHandler', () => {
    it('should create a task and send a notification', async () => {
      const mockRequest = {
        body: { title: 'Test Task', description: 'Test Description' },
        loggedUser: { user_id: 'user123', email: 'user@example.com' },
      } as unknown as FastifyRequest

      const mockTask = { id: 'task123', title: 'Test Task' }
      vi.spyOn(taskModel, 'createTask').mockResolvedValue(mockTask)

      await createTaskHandler(mockRequest, mockReply)

      expect(taskModel.createTask).toHaveBeenCalledWith(
        'user123',
        mockRequest.body,
      )
      expect(notificationMiddleware.sendNotification).toHaveBeenCalledWith(
        'user@example.com',
        'task_create',
        { task_name: 'Test Task' },
      )
      expect(mockReply.status).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith(mockTask)
    })

    it('should handle errors and send error response', async () => {
      const mockRequest = {
        body: { title: 'Test Task', description: 'Test Description' },
        loggedUser: { user_id: 'user123', email: 'user@example.com' },
      } as unknown as FastifyRequest

      const mockError = new Error('Database error')
      vi.spyOn(taskModel, 'createTask').mockRejectedValue(mockError)
      const treatedError = { status: 500, message: 'Internal Server Error' }
      vi.spyOn(errorHandlingMiddleware, 'errorHandler').mockReturnValue(
        treatedError,
      )

      await createTaskHandler(mockRequest, mockReply)

      expect(errorHandlingMiddleware.errorHandler).toHaveBeenCalledWith(
        mockError,
      )
      expect(mockReply.status).toHaveBeenCalledWith(500)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      })
    })
  })

  describe('listTasksHandler', () => {
    it('should list tasks assigned to a user', async () => {
      const mockRequest = {
        query: { assigned_to: 'user123' },
      } as unknown as FastifyRequest

      const mockTasks = [{ id: 'task123', title: 'Test Task' }]
      vi.spyOn(taskModel, 'listTasks').mockResolvedValue(mockTasks)

      await listTasksHandler(mockRequest, mockReply)

      expect(taskModel.listTasks).toHaveBeenCalledWith('user123')
      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith(mockTasks)
    })
  })

  describe('getTaskHandler', () => {
    it('should get a task by ID', async () => {
      const mockRequest = {
        params: { task_id: 'task123' },
      } as unknown as FastifyRequest

      const mockTask = { id: 'task123', title: 'Test Task' }
      vi.spyOn(taskModel, 'getTaskById').mockResolvedValue(mockTask)

      await getTaskHandler(mockRequest, mockReply)

      expect(taskModel.getTaskById).toHaveBeenCalledWith('task123')
      expect(mockReply.status).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith(mockTask)
    })
  })

  describe('updateTaskHandler', () => {
    it('should update a task and send a notification', async () => {
      const mockRequest = {
        params: { task_id: 'task123' },
        body: { title: 'Updated Task' },
        loggedUser: { email: 'user@example.com' },
      } as unknown as FastifyRequest

      const mockUpdatedTask = { id: 'task123', title: 'Updated Task' }
      vi.spyOn(taskModel, 'updateTask').mockResolvedValue(mockUpdatedTask)

      await updateTaskHandler(mockRequest, mockReply)

      expect(taskModel.updateTask).toHaveBeenCalledWith('task123', {
        title: 'Updated Task',
      })
      expect(notificationMiddleware.sendNotification).toHaveBeenCalledWith(
        'user@example.com',
        'task_update',
        { task_name: 'Updated Task' },
      )
      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith(mockUpdatedTask)
    })
  })

  describe('deleteTaskHandler', () => {
    it('should delete a task and send a notification', async () => {
      const mockRequest = {
        params: { task_id: 'task123' },
        loggedUser: { email: 'user@example.com' },
      } as unknown as FastifyRequest

      const mockDeletedTask = { id: 'task123', title: 'Deleted Task' }
      vi.spyOn(taskModel, 'deleteTask').mockResolvedValue(mockDeletedTask)

      await deleteTaskHandler(mockRequest, mockReply)

      expect(taskModel.deleteTask).toHaveBeenCalledWith('task123')
      expect(notificationMiddleware.sendNotification).toHaveBeenCalledWith(
        'user@example.com',
        'task_deleted',
        { task_name: 'Deleted Task' },
      )
      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Task deleted successfully!',
      })
    })
  })
})
