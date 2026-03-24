/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkAccount, accountsController } from '../../src/controllers/accounts'
import { accountsService } from '../../src/services/accounts'

vi.mock('../../src/services/accounts', () => ({
  accountsService: {
    create: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    getByNameAndTeam: vi.fn(),
    getByTeamUuid: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'
const mockAccount = { uuid: VALID_UUID, name: 'Caisse', balance: 0, team_uuid: VALID_UUID }

// ---------------------------------------------------------
// MIDDLEWARE : checkAccount
// ---------------------------------------------------------

describe('Middleware checkAccount', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('Mode "exists" via params', () => {
    it('appelle next() si le compte existe', async () => {
      ;(accountsService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
      const req = { params: { uuid: VALID_UUID } } as any
      const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
      const next = vi.fn()

      await checkAccount('exists', 'params')(req, res, next)

      expect(res.locals.account).toEqual(mockAccount)
      expect(next).toHaveBeenCalled()
    })

    it("renvoie 404 si le compte n'existe pas", async () => {
      ;(accountsService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(null)
      const req = { params: { uuid: 'unknown' } } as any
      const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
      const next = vi.fn()

      await checkAccount('exists', 'params')(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('Mode "conflict" via body', () => {
    it("appelle next() si le compte n'existe pas encore", async () => {
      ;(accountsService.getByNameAndTeam as ReturnType<typeof vi.fn>).mockResolvedValue(null)
      const req = { body: { name: 'Caisse', team_uuid: VALID_UUID } } as any
      const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
      const next = vi.fn()

      await checkAccount('conflict', 'body')(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    it('renvoie 400 si le compte existe déjà ', async () => {
      ;(accountsService.getByNameAndTeam as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
      const req = { body: { name: 'Caisse', team_uuid: VALID_UUID } } as any
      const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
      const next = vi.fn()

      await checkAccount('conflict', 'body')(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })
})

// ─────────────────────────────────────────────────────────
// CONTRÔLEUR : accountsController
// ─────────────────────────────────────────────────────────

describe('Contrôleur accountsController', () => {
  beforeEach(() => vi.clearAllMocks())

  it('create → renvoie 201', async () => {
    ;(accountsService.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
    const req = { body: { name: 'Caisse', team_uuid: VALID_UUID } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await accountsController.create(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('getAll → renvoie 200', async () => {
    ;(accountsService.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([mockAccount])
    const req = {} as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await accountsController.getAll(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('getById → renvoie 200', async () => {
    ;(accountsService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
    const req = { params: { uuid: VALID_UUID } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await accountsController.getById(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('getByTeamUuid → renvoie 200', async () => {
    ;(accountsService.getByTeamUuid as ReturnType<typeof vi.fn>).mockResolvedValue([mockAccount])
    const req = { params: { teamUuid: VALID_UUID } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await accountsController.getByTeamUuid(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('update → renvoie 200', async () => {
    ;(accountsService.update as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
    const req = { params: { uuid: VALID_UUID }, body: { name: 'Nouveau' } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await accountsController.update(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('delete → renvoie 200', async () => {
    ;(accountsService.delete as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
    const req = { params: { uuid: VALID_UUID } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await accountsController.delete(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
