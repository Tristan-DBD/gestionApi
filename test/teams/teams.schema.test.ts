import { describe, it, expect } from 'vitest'
import { createTeamSchema, updateTeamSchema, getByIdTeamSchema } from '../../src/schemas/teams'

// ─────────────────────────────────────────────────────────
// SCHÉMA : createTeamSchema
// ─────────────────────────────────────────────────────────

describe('Schéma createTeamSchema', () => {
  it('accepte un nom valide (A, B, C) et un PIN de 4 chiffres', () => {
    const result = createTeamSchema.safeParse({ name: 'A', pin: '1234' })
    expect(result.success).toBe(true)
  })

  it('accepte les 3 noms possibles : A, B, C', () => {
    expect(createTeamSchema.safeParse({ name: 'A', pin: '0000' }).success).toBe(true)
    expect(createTeamSchema.safeParse({ name: 'B', pin: '0000' }).success).toBe(true)
    expect(createTeamSchema.safeParse({ name: 'C', pin: '0000' }).success).toBe(true)
  })

  it('rejette un nom invalide (D, TeamA, etc.)', () => {
    const result = createTeamSchema.safeParse({ name: 'D', pin: '1234' })
    expect(result.success).toBe(false)
  })

  it('rejette un nom vide', () => {
    const result = createTeamSchema.safeParse({ name: '', pin: '1234' })
    expect(result.success).toBe(false)
  })

  it('rejette un PIN trop court (moins de 4 chiffres)', () => {
    const result = createTeamSchema.safeParse({ name: 'A', pin: '123' })
    expect(result.success).toBe(false)
  })

  it('rejette un PIN trop long (plus de 4 chiffres)', () => {
    const result = createTeamSchema.safeParse({ name: 'A', pin: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejette un PIN avec des lettres', () => {
    const result = createTeamSchema.safeParse({ name: 'A', pin: 'abcd' })
    expect(result.success).toBe(false)
  })

  it('rejette un PIN avec des caractères spéciaux', () => {
    const result = createTeamSchema.safeParse({ name: 'A', pin: '12.4' })
    expect(result.success).toBe(false)
  })

  it('rejette des données manquantes', () => {
    const result = createTeamSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────
// SCHÉMA : updateTeamSchema
// ─────────────────────────────────────────────────────────

describe('Schéma updateTeamSchema', () => {
  it('accepte un PIN valide de 4 chiffres', () => {
    const result = updateTeamSchema.safeParse({ pin: '9999' })
    expect(result.success).toBe(true)
  })

  it('rejette si le PIN est manquant', () => {
    const result = updateTeamSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejette un PIN trop court', () => {
    const result = updateTeamSchema.safeParse({ pin: '12' })
    expect(result.success).toBe(false)
  })

  it('rejette un PIN avec des lettres', () => {
    const result = updateTeamSchema.safeParse({ pin: 'abcd' })
    expect(result.success).toBe(false)
  })

  it("ignore le champ 'name' même s'il est fourni (omit)", () => {
    const result = updateTeamSchema.safeParse({ pin: '1234', name: 'A' })
    expect(result.success).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────
// SCHÉMA : getByIdTeamSchema
// ─────────────────────────────────────────────────────────

describe('Schéma getByIdTeamSchema', () => {
  it('accepte un UUID valide', () => {
    const result = getByIdTeamSchema.safeParse({
      uuid: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(true)
  })

  it('rejette un UUID mal formé', () => {
    const result = getByIdTeamSchema.safeParse({ uuid: '123' })
    expect(result.success).toBe(false)
  })

  it("rejette si l'UUID est manquant", () => {
    const result = getByIdTeamSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejette un UUID avec des espaces', () => {
    const result = getByIdTeamSchema.safeParse({ uuid: '  ' })
    expect(result.success).toBe(false)
  })
})
