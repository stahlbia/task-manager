// tests/unit/auth.controller.spec.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FastifyRequest, FastifyReply } from 'fastify'
import {
  loginHandler,
  logoutHandler,
  isTokenBlacklisted,
} from '../../src/controllers/auth.controller'
import { usersTableSim } from '../../src/db/db'
import { compare } from 'bcrypt'
import { JWT } from '@fastify/jwt'

// Mock das dependências externas
vi.mock('bcrypt')

describe('Auth Handlers (Unit Tests)', () => {
  let mockRequest: Partial<FastifyRequest>
  let mockReply: Partial<FastifyReply>
  let mockJwt: Partial<JWT>

  beforeEach(() => {
    // Limpa a simulação do banco e reseta os mocks
    usersTableSim.length = 0
    vi.resetAllMocks()

    // Popula o "banco" com um usuário de teste
    usersTableSim.push({
      user_id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword123', // Senha já "hasheada"
      is_deleted: false,
      created_at: new Date(),
    })

    // Mock do objeto reply do Fastify
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      code: vi.fn().mockReturnThis(),
    }

    // Mock do plugin JWT do Fastify
    mockJwt = {
      sign: vi.fn(),
    }
  })

  // Testes para o loginHandler
  describe('loginHandler', () => {
    it('deve autenticar o usuário e retornar um token com status 201', async () => {
      // Arrange
      mockRequest = {
        body: { email: 'test@example.com', password: 'password123' },
        // Adicionando '!' para garantir ao TS que mockJwt não é undefined
        jwt: mockJwt! as JWT,
      }
      const mockToken = 'mock-jwt-token'

      vi.mocked(compare).mockResolvedValue(true) // Simula que a senha bate
      // Adicionando '!' para garantir ao TS que mockJwt não é undefined
      vi.mocked(mockJwt!.sign).mockReturnValue(mockToken)

      // Act
      await loginHandler(mockRequest as any, mockReply as FastifyReply)

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith({
        accessToken: mockToken,
        user: expect.objectContaining({
          user_id: 'test-user-id',
          email: 'test@example.com',
        }),
      })
      // Garante que a senha do usuário não é retornada
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.not.objectContaining({ user: { password: expect.any(String) } }),
      )
    })

    it('deve retornar erro 401 se o usuário não for encontrado', async () => {
      // Arrange
      mockRequest = {
        body: { email: 'notfound@example.com', password: 'password123' },
        jwt: mockJwt! as JWT, // Adicionado '!' por consistência
      }

      // Act
      await loginHandler(mockRequest as any, mockReply as FastifyReply)

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(401)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'invalid email or password',
      })
    })

    it('deve retornar erro 401 se a senha estiver incorreta', async () => {
      // Arrange
      mockRequest = {
        body: { email: 'test@example.com', password: 'wrongpassword' },
        jwt: mockJwt! as JWT, // Adicionado '!' por consistência
      }

      vi.mocked(compare).mockResolvedValue(false) // Simula que a senha não bate

      // Act
      await loginHandler(mockRequest as any, mockReply as FastifyReply)

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(401)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'invalid email or password',
      })
    })
  })

  // Testes para o logoutHandler
  describe('logoutHandler', () => {
    it('deve adicionar o token à blacklist e retornar sucesso 201', async () => {
      // Arrange
      const tokenToBlacklist = 'Bearer valid-token-to-blacklist'
      mockRequest = {
        headers: {
          authorization: tokenToBlacklist,
        },
      }

      // Garante que o token não está na blacklist antes do teste
      const set = (global as any).tokenBlacklist as Set<string>
      if (set) {
        set.delete(tokenToBlacklist)
      }

      // Act
      await logoutHandler(mockRequest as any, mockReply as FastifyReply)

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'User logged out successfully',
      })
      expect(isTokenBlacklisted(tokenToBlacklist)).toBe(true)
    })
  })
})
