/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authController } from '../../src/controllers/auth'
import { authService } from '../../src/services/auth'
import { loginSchema } from '../../src/schemas/auth'

vi.mock('../../src/services/auth', () => ({
  authService: {
    login: vi.fn(),
  },
}))

// ─────────────────────────────────────────────────────────
// SCHÉMA : loginSchema
// ─────────────────────────────────────────────────────────

describe('Schéma loginSchema', () => {
  it('accepte un login valide', () => {
    const result = loginSchema.safeParse({
      name: 'Team A',
      pin: '1234',
    })
    expect(result.success).toBe(true)
  })

  it('rejette un nom vide', () => {
    const result = loginSchema.safeParse({
      name: '',
      pin: '1234',
    })
    expect(result.success).toBe(false)
  })

  it('rejette un PIN trop court', () => {
    const result = loginSchema.safeParse({
      name: 'Team A',
      pin: '123',
    })
    expect(result.success).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────
// CONTRÔLEUR : authController
// ─────────────────────────────────────────────────────────

describe('Contrôleur authController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login → renvoie 200 avec le token si succès', async () => {
    ;(authService.login as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      status: 200,
      data: 'fake-jwt-token',
    })

    const req = { body: { name: 'A', pin: '1234' } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await authController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({
      success: true,
      status: 200,
      data: {
        fields: undefined,
        message: 'fake-jwt-token',
      },
    })
  })

  it("login → renvoie 404 si la team n'existe pas", async () => {
    ;(authService.login as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: false,
      status: 404,
      message: 'Team not found',
    })

    const req = { body: { name: 'Inconnue', pin: '1234' } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await authController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({
      success: false,
      status: 404,
      data: {
        fields: undefined,
        message: 'Team not found',
      },
    })
  })

  it('login → renvoie 401 si le PIN est incorrect', async () => {
    ;(authService.login as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: false,
      status: 401,
      message: 'Invalid password',
    })

    const req = { body: { name: 'A', pin: 'wrong' } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await authController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(json).toHaveBeenCalledWith({
      success: false,
      status: 401,
      data: {
        fields: undefined,
        message: 'Invalid password',
      },
    })
  })
})
