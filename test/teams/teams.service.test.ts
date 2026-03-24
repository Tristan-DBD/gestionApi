/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { teamsService } from '../../src/services/teams'
import prisma from '../../src/config/db'
import bcrypt from 'bcrypt'

vi.mock('../../src/config/db', () => ({
  default: {
    teams: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
  },
}))

// ─────────────────────────────────────────────────────────
// SERVICE : teamsService
// ─────────────────────────────────────────────────────────

describe('teams service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("Création d'une team", async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
    ;(prisma.teams.create as any).mockResolvedValue(mockTeam)
    ;(bcrypt.hash as any).mockResolvedValue('hashed')
    const result = await teamsService.create('TeamA', '1234')
    expect(result).toEqual(mockTeam)
  })

  it('Récupération de toutes les teams', async () => {
    const mockTeams = [
      { uuid: '123', name: 'TeamA', pin_hash: 'hashed' },
      { uuid: '456', name: 'TeamB', pin_hash: 'hashed' },
    ]
    ;(prisma.teams.findMany as any).mockResolvedValue(mockTeams)
    const result = await teamsService.getAll()
    expect(result).toEqual(mockTeams)
  })

  it("Récupération d'une team par son uuid", async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
    ;(prisma.teams.findUnique as any).mockResolvedValue(mockTeam)
    const result = await teamsService.getById('123')
    expect(result).toEqual(mockTeam)
  })

  it("Mise Ã  jour d'une team", async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
    ;(prisma.teams.update as any).mockResolvedValue(mockTeam)
    const result = await teamsService.update('123', '1234')
    expect(result).toEqual(mockTeam)
  })

  it("Suppression d'une team", async () => {
    const mockTeam = { uuid: '123', name: 'TeamA', pin_hash: 'hashed' }
    ;(prisma.teams.delete as any).mockResolvedValue(mockTeam)
    const result = await teamsService.delete('123')
    expect(result).toEqual(mockTeam)
  })
})
