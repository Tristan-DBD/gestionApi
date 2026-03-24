import { describe, it, expect } from 'vitest'
import {
  createTransactionSchema,
  updateTransactionSchema,
  getByIdTransactionSchema,
} from '../../src/schemas/transactions'

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'

describe('Schéma createTransactionSchema', () => {
  it('accepte une transaction DEPOSIT valide', () => {
    const result = createTransactionSchema.safeParse({
      account_uuid: VALID_UUID,
      type: 'DEPOSIT',
      amount: 100,
    })
    expect(result.success).toBe(true)
  })

  it('accepte une transaction WITHDRAW valide', () => {
    const result = createTransactionSchema.safeParse({
      account_uuid: VALID_UUID,
      type: 'WITHDRAW',
      amount: 50.5,
    })
    expect(result.success).toBe(true)
  })

  it('accepte une transaction DEFINE valide', () => {
    const result = createTransactionSchema.safeParse({
      account_uuid: VALID_UUID,
      type: 'DEFINE',
      amount: 200,
    })
    expect(result.success).toBe(true)
  })

  it('rejette un type invalide', () => {
    const result = createTransactionSchema.safeParse({
      account_uuid: VALID_UUID,
      type: 'TRANSFER',
      amount: 100,
    })
    expect(result.success).toBe(false)
  })

  it('rejette un montant négatif', () => {
    const result = createTransactionSchema.safeParse({
      account_uuid: VALID_UUID,
      type: 'DEPOSIT',
      amount: -50,
    })
    expect(result.success).toBe(false)
  })

  it('rejette un montant égal à zéro', () => {
    const result = createTransactionSchema.safeParse({
      account_uuid: VALID_UUID,
      type: 'DEPOSIT',
      amount: 0,
    })
    expect(result.success).toBe(false)
  })

  it('rejette un montant sous forme de texte', () => {
    const result = createTransactionSchema.safeParse({
      account_uuid: VALID_UUID,
      type: 'DEPOSIT',
      amount: 'cent',
    })
    expect(result.success).toBe(false)
  })

  it('rejette un account_uuid invalide', () => {
    const result = createTransactionSchema.safeParse({
      account_uuid: 'pas-un-uuid',
      type: 'DEPOSIT',
      amount: 100,
    })
    expect(result.success).toBe(false)
  })

  it('rejette si des champs sont manquants', () => {
    const result = createTransactionSchema.safeParse({ type: 'DEPOSIT' })
    expect(result.success).toBe(false)
  })
})

describe('Schéma updateTransactionSchema', () => {
  it('accepte une mise à jour valide (type + amount)', () => {
    const result = updateTransactionSchema.safeParse({ type: 'WITHDRAW', amount: 30 })
    expect(result.success).toBe(true)
  })

  it('accepte un DEFINE', () => {
    const result = updateTransactionSchema.safeParse({ type: 'DEFINE', amount: 500 })
    expect(result.success).toBe(true)
  })

  it('rejette un type invalide', () => {
    const result = updateTransactionSchema.safeParse({ type: 'INVALID', amount: 100 })
    expect(result.success).toBe(false)
  })

  it('rejette un montant négatif', () => {
    const result = updateTransactionSchema.safeParse({ type: 'DEPOSIT', amount: -10 })
    expect(result.success).toBe(false)
  })

  it("ignore account_uuid s'il est fourni (omit)", () => {
    const result = updateTransactionSchema.safeParse({
      type: 'DEPOSIT',
      amount: 10,
      account_uuid: VALID_UUID,
    })
    expect(result.success).toBe(true)
  })
})

describe('Schéma getByIdTransactionSchema', () => {
  it('accepte un UUID valide', () => {
    const result = getByIdTransactionSchema.safeParse({ uuid: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('rejette un UUID mal formé', () => {
    const result = getByIdTransactionSchema.safeParse({ uuid: '123abc' })
    expect(result.success).toBe(false)
  })

  it("rejette si l'UUID est manquant", () => {
    const result = getByIdTransactionSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
