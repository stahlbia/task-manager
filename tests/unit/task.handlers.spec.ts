// tests/unit/task.handlers.spec.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FastifyRequest, FastifyReply } from 'fastify'

// 1. Importe os CONTROLLERS que você quer testar
import { deleteTaskHandler } from '../../src/controllers/task.controller'

// 2. Importe os TIPOS/SCHEMAS dos seus arquivos .schema.ts
import { UserSchema } from '../../src/schemas/user.schema'
import { TaskSchema } from '../../src/schemas/tasks.schema'

// 3. CORREÇÃO: Importe as TABELAS de simulação do seu novo arquivo de banco de dados
import { usersTableSim, tasksTableSim } from '../../src/db/dbSimulator'

describe('Task Handlers (Unit Tests)', () => {
  let mockRequest: Partial<FastifyRequest>
  let mockReply: Partial<FastifyReply>
  let testUser: UserSchema

  beforeEach(() => {
    // Limpeza e setup inicial
    usersTableSim.length = 0
    tasksTableSim.length = 0
    vi.resetAllMocks()

    // Mock do objeto de resposta
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    }

    // Cria um usuário para ser o "dono" das tarefas
    testUser = {
      user_id: 'user-001',
      name: 'Task Test User',
      email: 'task.user@test.com',
      password: 'hashedpassword',
      is_deleted: false,
      created_at: new Date(),
    }
    usersTableSim.push(testUser)
  })

  // Testes para a função de deletar tarefa
  describe('deleteTaskHandler', () => {
    it('deve deletar uma tarefa existente com sucesso e retornar 204', async () => {
      // Arrange: Prepara o cenário
      const existingTask: TaskSchema = {
        task_id: 'task-to-delete',
        title: 'Tarefa que será deletada',
        description: '...',
        status: 'pending',
        assigned_to: testUser.user_id,
      }
      tasksTableSim.push(existingTask) // Adiciona a tarefa no "banco"

      // Simula a requisição com o ID da tarefa nos parâmetros
      mockRequest = {
        params: { task_id: existingTask.task_id },
      }

      // Act: Executa a função a ser testada
      await deleteTaskHandler(mockRequest as any, mockReply as FastifyReply)

      // Assert: Verifica se o resultado foi o esperado
      expect(mockReply.status).toHaveBeenCalledWith(204)
      expect(mockReply.send).toHaveBeenCalled()
      expect(tasksTableSim.length).toBe(0) // A tarefa deve ter sido removida do array
    })

    it('deve retornar erro 404 se a tarefa a ser deletada não for encontrada', async () => {
      // Arrange
      mockRequest = {
        params: { task_id: 'id-nao-existente' },
      }
      expect(tasksTableSim.length).toBe(0) // Garante que o "banco" está vazio

      // Act
      await deleteTaskHandler(mockRequest as any, mockReply as FastifyReply)

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(404)
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Task not found' })
    })
  })
})
