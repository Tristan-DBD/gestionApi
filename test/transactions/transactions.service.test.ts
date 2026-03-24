/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { transactionsService } from '../../src/services/transactions'
import prisma from '../../src/config/db'

vi.mock('../../src/config/db', () => ({
  default: {
    $transaction: vi.fn(),
    transactions: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    accounts: {
      update: vi.fn(),
    },
  },
}))

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'
const mockTransaction = {
  uuid: VALID_UUID,
  account_uuid: VALID_UUID,
  type: 'DEPOSIT',
  amount: 100,
  created_at: new Date(),
}

describe('transactions service', () => {
  beforeEach(() => vi.clearAllMocks())

  it('create → exécute une transaction Prisma et retourne la transaction', async () => {
    ;(prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
      (fn: (tx: any) => Promise<any>) =>
        fn({
          transactions: { create: vi.fn().mockResolvedValue(mockTransaction) },
          accounts: { update: vi.fn() },
        }),
    )
    const result = await transactionsService.create(VALID_UUID, 'DEPOSIT' as any, 100)
    expect(result).toEqual(mockTransaction)
  })

  it('create avec DEFINE → appelle accounts.update avec set au lieu de increment', async () => {
    const accountsUpdate = vi.fn()
    ;(prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
      (fn: (tx: any) => Promise<any>) =>
        fn({
          transactions: { create: vi.fn().mockResolvedValue(mockTransaction) },
          accounts: { update: accountsUpdate },
        }),
    )
    await transactionsService.create(VALID_UUID, 'DEFINE' as any, 100)
    expect(accountsUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: { balance: 100 } }))
  })

  it('getAll → retourne la liste des transactions', async () => {
    ;(prisma.transactions.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([mockTransaction])
    const result = await transactionsService.getAll()
    expect(result).toEqual([mockTransaction])
  })

  it('getAll → retourne un tableau vide si aucune transaction', async () => {
    ;(prisma.transactions.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    const result = await transactionsService.getAll()
    expect(result).toEqual([])
  })

  it('getById → retourne la transaction si trouvée', async () => {
    ;(prisma.transactions.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockTransaction)
    const result = await transactionsService.getById(VALID_UUID)
    expect(result).toEqual(mockTransaction)
  })

  it('getById → retourne null si non trouvée', async () => {
    ;(prisma.transactions.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const result = await transactionsService.getById('unknown')
    expect(result).toBeNull()
  })

  it('getByAccountUuid → retourne les transactions du compte', async () => {
    ;(prisma.transactions.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([mockTransaction])
    const result = await transactionsService.getByAccountUuid(VALID_UUID)
    expect(result).toEqual([mockTransaction])
  })

  it('delete → ne modifie pas le solde si le type est DEFINE', async () => {
    const defineTransaction = { ...mockTransaction, type: 'DEFINE' }
    const accountsUpdate = vi.fn()
    const transactionsDelete = vi.fn().mockResolvedValue(defineTransaction)
    ;(prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
      (fn: (tx: any) => Promise<any>) =>
        fn({
          transactions: {
            findUniqueOrThrow: vi.fn().mockResolvedValue(defineTransaction),
            delete: transactionsDelete,
          },
          accounts: { update: accountsUpdate },
        }),
    )
    await transactionsService.delete(VALID_UUID)
    expect(accountsUpdate).not.toHaveBeenCalled()
  })

  it('delete → modifie le solde pour un DEPOSIT (soustrait le montant)', async () => {
    const accountsUpdate = vi.fn()
    ;(prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
      (fn: (tx: any) => Promise<any>) =>
        fn({
          transactions: {
            findUniqueOrThrow: vi.fn().mockResolvedValue(mockTransaction),
            delete: vi.fn().mockResolvedValue(mockTransaction),
          },
          accounts: { update: accountsUpdate },
        }),
    )
    await transactionsService.delete(VALID_UUID)
    expect(accountsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { balance: { increment: -100 } } }),
    )
  })
})
