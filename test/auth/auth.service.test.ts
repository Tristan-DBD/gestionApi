/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../../src/services/auth'
import prisma from '../../src/config/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

vi.mock('../../src/config/db', () => ({
  default: {
    teams: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
  },
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
  },
}))

// ─────────────────────────────────────────────────────────
// SERVICE : authService
// ─────────────────────────────────────────────────────────

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("devrait retourner une erreur si la team n'existe pas", async () => {
    ;(prisma.teams.findUnique as any).mockResolvedValue(null)

    const result = await authService.login('Inconnue', '1234')

    expect(result).toEqual({
      success: false,
      status: 404,
      message: 'Team not found',
    })
  })

  it('devrait retourner une erreur si le PIN est incorrect', async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
    ;(prisma.teams.findUnique as any).mockResolvedValue(mockTeam)
    ;(bcrypt.compare as any).mockResolvedValue(false)

    const result = await authService.login('TeamA', 'wrong')

    expect(result).toEqual({
      success: false,
      status: 401,
      message: 'Invalid password',
    })
  })

  it('devrait retourner un token si les identifiants sont corrects', async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
    ;(prisma.teams.findUnique as any).mockResolvedValue(mockTeam)
    ;(bcrypt.compare as any).mockResolvedValue(true)
    ;(jwt.sign as any).mockReturnValue('fake-token')

    const result = await authService.login('TeamA', '1234')

    expect(result.success).toBe(true)
    expect(result.data).toBe('fake-token')
  })
})
