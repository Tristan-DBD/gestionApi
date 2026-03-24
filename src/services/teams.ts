import prisma from '../config/db'
import bcrypt from 'bcrypt'

export const teamsService = {
  async create(name: string, pin: string) {
    const user = await prisma.teams.create({
      data: {
        name,
        pin_hash: await bcrypt.hash(pin, 10),
      },
    })
    return user
  },

  async getAll() {
    const teams = await prisma.teams.findMany({
      include: {
        accounts: true,
      },
    })
    return teams
  },

  async getById(uuid: string) {
    const team = await prisma.teams.findUnique({
      where: {
        uuid,
      },
      include: {
        accounts: true,
      },
    })
    return team
  },

  async getByName(name: string) {
    const team = await prisma.teams.findUnique({
      where: {
        name,
      },
      include: {
        accounts: true,
      },
    })
    return team
  },

  async update(uuid: string, pin: string) {
    const team = await prisma.teams.update({
      where: {
        uuid,
      },
      data: {
        pin_hash: await bcrypt.hash(pin, 10),
      },
      include: {
        accounts: true,
      },
    })
    return team
  },

  async delete(uuid: string) {
    const team = await prisma.teams.delete({
      where: {
        uuid,
      },
      include: {
        accounts: true,
      },
    })
    return team
  },
}
