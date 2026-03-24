/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkTransaction, transactionController } from '../../src/controllers/transactions'
import { transactionsService } from '../../src/services/transactions'

vi.mock('../../src/services/transactions', () => ({
  transactionsService: {
    create: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    getByAccountUuid: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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

// ─────────────────────────────────────────────────────────
// MIDDLEWARE : checkTransaction
// ─────────────────────────────────────────────────────────

describe('Middleware checkTransaction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('appelle next() si la transaction existe', async () => {
    ;(transactionsService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockTransaction)
    const req = { params: { uuid: VALID_UUID } } as any
    const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
    const next = vi.fn()

    await checkTransaction('exists', 'params')(req, res, next)

    expect(res.locals.transaction).toEqual(mockTransaction)
    expect(next).toHaveBeenCalled()
  })

  it("renvoie 404 si la transaction n'existe pas", async () => {
    ;(transactionsService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = { params: { uuid: 'unknown' } } as any
    const res = { locals: {}, status: vi.fn().mockReturnValue({ json: vi.fn() }) } as any
    const next = vi.fn()

    await checkTransaction('exists', 'params')(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(404)
  })
})

// ─────────────────────────────────────────────────────────
// CONTRÃ”LEUR : transactionController
// ─────────────────────────────────────────────────────────

describe('Contrôleur transactionController', () => {
  beforeEach(() => vi.clearAllMocks())

  it('create → renvoie 201', async () => {
    ;(transactionsService.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockTransaction)
    const req = { body: { account_uuid: VALID_UUID, type: 'DEPOSIT', amount: 100 } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await transactionController.create(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('getAll → renvoie 200', async () => {
    ;(transactionsService.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([mockTransaction])
    const req = {} as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await transactionController.getAll(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('getById → renvoie 200', async () => {
    ;(transactionsService.getById as ReturnType<typeof vi.fn>).mockResolvedValue(mockTransaction)
    const req = { params: { uuid: VALID_UUID } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await transactionController.getById(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('getByAccountUuid → renvoie 200', async () => {
    ;(transactionsService.getByAccountUuid as ReturnType<typeof vi.fn>).mockResolvedValue([
      mockTransaction,
    ])
    const req = { params: { uuid: VALID_UUID } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await transactionController.getByAccountUuid(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('update → renvoie 200', async () => {
    ;(transactionsService.update as ReturnType<typeof vi.fn>).mockResolvedValue(mockTransaction)
    const req = { params: { uuid: VALID_UUID }, body: { type: 'WITHDRAW', amount: 50 } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await transactionController.update(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('delete → renvoie 200', async () => {
    ;(transactionsService.delete as ReturnType<typeof vi.fn>).mockResolvedValue(mockTransaction)
    const req = { params: { uuid: VALID_UUID } } as any
    const json = vi.fn()
    const res = { status: vi.fn().mockReturnValue({ json }) } as any

    await transactionController.delete(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
