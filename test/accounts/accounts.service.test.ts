import { describe, it, expect, vi, beforeEach } from 'vitest'
import { accountsService } from '../../src/services/accounts'
import prisma from '../../src/config/db'

vi.mock('../../src/config/db', () => ({
  default: {
    accounts: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'
const mockAccount = { uuid: VALID_UUID, name: 'Caisse', balance: 0, team_uuid: VALID_UUID }

// ─────────────────────────────────────────────────────────
// SERVICE : accountsService
// ─────────────────────────────────────────────────────────

describe('accounts service', () => {
  beforeEach(() => vi.clearAllMocks())

  it('create → crée un compte avec un solde de 0', async () => {
    ;(prisma.accounts.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
    const result = await accountsService.create('Caisse', VALID_UUID)
    expect(result).toEqual(mockAccount)
  })

  it('getAll → retourne la liste des comptes', async () => {
    ;(prisma.accounts.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([mockAccount])
    const result = await accountsService.getAll()
    expect(result).toEqual([mockAccount])
  })

  it('getAll → retourne un tableau vide si aucun compte', async () => {
    ;(prisma.accounts.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    const result = await accountsService.getAll()
    expect(result).toEqual([])
  })

  it('getById → retourne le compte si trouvé', async () => {
    ;(prisma.accounts.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
    const result = await accountsService.getById(VALID_UUID)
    expect(result).toEqual(mockAccount)
  })

  it('getById → retourne null si non trouvé', async () => {
    ;(prisma.accounts.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const result = await accountsService.getById('unknown')
    expect(result).toBeNull()
  })

  it('getByNameAndTeam → retourne le compte correspondant', async () => {
    ;(prisma.accounts.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
    const result = await accountsService.getByNameAndTeam('Caisse', VALID_UUID)
    expect(result).toEqual(mockAccount)
  })

  it('getByNameAndTeam → retourne null si non trouvé', async () => {
    ;(prisma.accounts.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const result = await accountsService.getByNameAndTeam('Inconnu', VALID_UUID)
    expect(result).toBeNull()
  })

  it('getByTeamUuid → retourne les comptes de la team', async () => {
    ;(prisma.accounts.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([mockAccount])
    const result = await accountsService.getByTeamUuid(VALID_UUID)
    expect(result).toEqual([mockAccount])
  })

  it('update → retourne le compte mis à jour', async () => {
    const updated = { ...mockAccount, name: 'Nouvelle caisse' }
    ;(prisma.accounts.update as ReturnType<typeof vi.fn>).mockResolvedValue(updated)
    const result = await accountsService.update(VALID_UUID, { name: 'Nouvelle caisse' })
    expect(result).toEqual(updated)
  })

  it('delete → retourne le compte supprimé', async () => {
    ;(prisma.accounts.delete as ReturnType<typeof vi.fn>).mockResolvedValue(mockAccount)
    const result = await accountsService.delete(VALID_UUID)
    expect(result).toEqual(mockAccount)
  })

  it('create → lance une erreur si Prisma échoue', async () => {
    ;(prisma.accounts.create as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB Error'))
    await expect(accountsService.create('Caisse', VALID_UUID)).rejects.toThrow('DB Error')
  })

  it('delete → lance une erreur si le compte est introuvable', async () => {
    ;(prisma.accounts.delete as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Not found'))
    await expect(accountsService.delete('unknown')).rejects.toThrow('Not found')
  })
})
