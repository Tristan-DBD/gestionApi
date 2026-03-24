import { describe, it, expect } from 'vitest'
import {
  createAccountSchema,
  updateAccountSchema,
  deleteAccountSchema,
} from '../../src/schemas/accounts'

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'

// ─────────────────────────────────────────────────────────
// SCHÉMA : createAccountSchema
// ─────────────────────────────────────────────────────────

describe('Schéma createAccountSchema', () => {
  it('accepte un compte valide', () => {
    const result = createAccountSchema.safeParse({
      name: 'Caisse principale',
      team_uuid: VALID_UUID,
    })
    expect(result.success).toBe(true)
  })

  it('accepte un compte avec balance explicite', () => {
    const result = createAccountSchema.safeParse({
      name: 'Réserve',
      team_uuid: VALID_UUID,
      balance: 500,
    })
    expect(result.success).toBe(true)
  })

  it('utilise 0 comme balance par défaut', () => {
    const result = createAccountSchema.safeParse({
      name: 'Réserve',
      team_uuid: VALID_UUID,
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.balance).toBe(0)
  })

  it('rejette un nom trop court (moins de 2 caractères)', () => {
    const result = createAccountSchema.safeParse({ name: 'A', team_uuid: VALID_UUID })
    expect(result.success).toBe(false)
  })

  it('rejette un nom trop long (plus de 20 caractères)', () => {
    const result = createAccountSchema.safeParse({
      name: 'A'.repeat(21),
      team_uuid: VALID_UUID,
    })
    expect(result.success).toBe(false)
  })

  it('rejette un team_uuid invalide', () => {
    const result = createAccountSchema.safeParse({ name: 'Caisse', team_uuid: 'non-uuid' })
    expect(result.success).toBe(false)
  })

  it('rejette si le nom est manquant', () => {
    const result = createAccountSchema.safeParse({ team_uuid: VALID_UUID })
    expect(result.success).toBe(false)
  })

  it('rejette si team_uuid est manquant', () => {
    const result = createAccountSchema.safeParse({ name: 'Caisse' })
    expect(result.success).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────
// SCHÉMA : updateAccountSchema
// ─────────────────────────────────────────────────────────

describe('Schéma updateAccountSchema', () => {
  it('accepte une mise à jour partielle (seulement le nom)', () => {
    const result = updateAccountSchema.safeParse({ name: 'Nouveau nom' })
    expect(result.success).toBe(true)
  })

  it('accepte une mise à jour partielle (seulement la balance)', () => {
    const result = updateAccountSchema.safeParse({ balance: 250 })
    expect(result.success).toBe(true)
  })

  it('accepte un objet vide (tout est optionnel avec partial)', () => {
    const result = updateAccountSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejette un nom trop court', () => {
    const result = updateAccountSchema.safeParse({ name: 'X' })
    expect(result.success).toBe(false)
  })

  it('rejette un team_uuid invalide', () => {
    const result = updateAccountSchema.safeParse({ team_uuid: 'invalide' })
    expect(result.success).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────
// SCHÉMA : deleteAccountSchema
// ─────────────────────────────────────────────────────────

describe('Schéma deleteAccountSchema (accountUuid)', () => {
  it('accepte un UUID valide', () => {
    const result = deleteAccountSchema.safeParse({ uuid: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('rejette un UUID mal formé', () => {
    const result = deleteAccountSchema.safeParse({ uuid: '123' })
    expect(result.success).toBe(false)
  })

  it("rejette si l'UUID est manquant", () => {
    const result = deleteAccountSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
