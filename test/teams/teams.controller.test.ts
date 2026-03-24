/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkTeam, teamsController } from '../../src/controllers/teams'
import { teamsService } from '../../src/services/teams'

vi.mock('../../src/services/teams', () => ({
  teamsService: {
    create: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    getByName: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

// ─────────────────────────────────────────────────────────
// MIDDLEWARE : checkTeam
// ─────────────────────────────────────────────────────────

describe('Middleware checkTeam', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Mode "exists"', () => {
    it('Appelle next() si la team existe', async () => {
      const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
      ;(teamsService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockTeam)

      const req = { params: { uuid: '123' } } as any
      const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
      const next = vi.fn()

      await checkTeam('exists', 'params')(req, res, next)

      expect(res.locals.team).toEqual(mockTeam)
      expect(next).toHaveBeenCalled()
    })

    it("Renvoie 404 si la team n'existe pas", async () => {
      ;(teamsService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(null)

      const req = { params: { uuid: '999' } } as any
      const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
      const next = vi.fn()

      await checkTeam('exists', 'params')(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('Mode "conflict"', () => {
    it("Appelle next() si la team n'existe pas encore", async () => {
      ;(teamsService.getByName as ReturnType<typeof vi.fn>).mockResolvedValue(null)

      const req = { body: { name: 'TeamA' } } as any
      const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
      const next = vi.fn()

      await checkTeam('conflict', 'body')(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    it('Renvoie 400 si la team existe déjà  (conflit)', async () => {
      const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
      ;(teamsService.getByName as ReturnType<typeof vi.fn>).mockResolvedValue(mockTeam)

      const req = { body: { name: 'TeamA' } } as any
      const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
      const next = vi.fn()

      await checkTeam('conflict', 'body')(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })
})

// ─────────────────────────────────────────────────────────
// CONTRÃ”LEUR : teamsController
// ─────────────────────────────────────────────────────────

describe('Contrôleur teamsController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('create → renvoie 201 avec la team créée', async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
    ;(teamsService.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockTeam)

    const req = { body: { name: 'TeamA', pin: '1234' } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await teamsController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalled()
  })

  it('getAll → renvoie 200 avec la liste des teams', async () => {
    const mockTeams = [
      { uuid: '123', name: 'TeamA', pin_hash: 'hashed' },
      { uuid: '456', name: 'TeamB', pin_hash: 'hashed' },
    ]
    ;(teamsService.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockTeams)

    const req = {} as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await teamsController.getAll(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalled()
  })

  it('getById → renvoie 200 avec la team', async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
    ;(teamsService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockTeam)

    const req = { params: { uuid: '123' } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await teamsController.getById(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('update → renvoie 200 avec la team mise Ã  jour', async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'new_hash' }
    ;(teamsService.update as ReturnType<typeof vi.fn>).mockResolvedValue(mockTeam)

    const req = { params: { uuid: '123' }, body: { pin: '5678' } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await teamsController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('delete → renvoie 200 avec la team supprimée', async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
    ;(teamsService.delete as ReturnType<typeof vi.fn>).mockResolvedValue(mockTeam)

    const req = { params: { uuid: '123' } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await teamsController.delete(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
  })
})
