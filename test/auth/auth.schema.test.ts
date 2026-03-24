import { describe, it, expect } from 'vitest'
import { authSchema, loginSchema } from '../../src/schemas/auth'

describe('Schéma authSchema / loginSchema', () => {
  it('accepte des identifiants valides', () => {
    const result = authSchema.safeParse({ name: 'A', pin: '1234' })
    expect(result.success).toBe(true)
  })

  it('accepte les 3 noms possibles : A, B, C', () => {
    expect(authSchema.safeParse({ name: 'A', pin: '0000' }).success).toBe(true)
    expect(authSchema.safeParse({ name: 'B', pin: '0000' }).success).toBe(true)
    expect(authSchema.safeParse({ name: 'C', pin: '0000' }).success).toBe(true)
  })

  it('rejette un nom invalide', () => {
    const result = authSchema.safeParse({ name: 'D', pin: '1234' })
    expect(result.success).toBe(false)
  })

  it('rejette un PIN trop court', () => {
    const result = authSchema.safeParse({ name: 'A', pin: '123' })
    expect(result.success).toBe(false)
  })

  it('rejette un PIN trop long', () => {
    const result = authSchema.safeParse({ name: 'A', pin: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejette un PIN contenant des lettres', () => {
    const result = authSchema.safeParse({ name: 'A', pin: 'abcd' })
    expect(result.success).toBe(false)
  })

  it('rejette des données manquantes', () => {
    const result = authSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('loginSchema est identique à authSchema', () => {
    const result = loginSchema.safeParse({ name: 'A', pin: '1234' })
    expect(result.success).toBe(true)
  })
})
