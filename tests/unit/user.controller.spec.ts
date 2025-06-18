// tests/unit/user.controller.spec.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FastifyRequest, FastifyReply } from 'fastify'
import { createUserHandler } from '../../src/controllers/user.controller'
import { UserSchema } from '../../src/schemas/user.schema'
import { usersTableSim } from '../../src/db/dbSimulator'
import { hash } from 'bcrypt'
import { randomUUID } from 'node:crypto'

// Mock das dependências
vi.mock('bcrypt')
vi.mock('node:crypto', () => ({
  randomUUID: vi.fn(),
}))

describe('User Handlers (Unit Tests)', () => {
  let mockRequest: Partial<FastifyRequest<{ Body: UserSchema }>>
  let mockReply: Partial<FastifyReply>

  beforeEach(() => {
    // Limpa a "tabela" e reseta os mocks
    usersTableSim.length = 0
    vi.resetAllMocks()

    // Mock do objeto reply do Fastify
    mockReply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
  })

  it('deve criar um usuário com sucesso e retornar 201', async () => {
    // Arrange
    const newUserData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
    }
    mockRequest = { body: newUserData as UserSchema }

    const mockUserId = 'mock-user-uuid'
    const mockHashedPassword = 'hashedPassword'

    vi.mocked(randomUUID).mockReturnValue(mockUserId)
    vi.mocked(hash).mockResolvedValue(mockHashedPassword)

    // Act
    await createUserHandler(mockRequest as any, mockReply as FastifyReply)

    // Assert
    expect(mockReply.code).toHaveBeenCalledWith(201)
    expect(mockReply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: mockUserId,
        name: newUserData.name,
      }),
    )
    expect(mockReply.send).not.toHaveBeenCalledWith(
      expect.objectContaining({ password: expect.any(String) }),
    )
    expect(usersTableSim.length).toBe(1)
    expect(usersTableSim[0].email).toBe(newUserData.email)
  })

  it('deve retornar erro 409 se o email já existir', async () => {
    // Arrange
    const existingEmail = 'existing@example.com'
    // Adiciona um usuário com o mesmo email ao "banco"
    usersTableSim.push({
      user_id: 'any-id',
      name: 'Existing User',
      email: existingEmail,
      password: 'any-password',
      is_deleted: false,
      created_at: new Date(),
    })

    mockRequest = {
      body: {
        name: 'Another User',
        email: existingEmail, // Tenta criar com o mesmo email
        password: 'password123',
      } as UserSchema,
    }

    // Act
    await createUserHandler(mockRequest as any, mockReply as FastifyReply)

    // Assert
    expect(mockReply.code).toHaveBeenCalledWith(409)
    expect(mockReply.send).toHaveBeenCalledWith('User already exists')
    expect(usersTableSim.length).toBe(1) // Garante que nenhum usuário foi adicionado
  })
})
