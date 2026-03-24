import prisma from '../config/db'

export const accountsService = {
  create: async (name: string, team_uuid: string) => {
    return prisma.accounts.create({
      data: {
        name,
        balance: 0,
        team_uuid,
      },
    })
  },
  getAll: async () => {
    return prisma.accounts.findMany({
      include: {
        transactions: true,
      },
    })
  },
  getById: async (uuid: string) => {
    return prisma.accounts.findUnique({
      where: {
        uuid,
      },
      include: {
        transactions: true,
      },
    })
  },
  getByNameAndTeam: async (name: string, team_uuid: string) => {
    return prisma.accounts.findFirst({
      where: {
        name,
        team_uuid,
      },
      include: {
        transactions: true,
      },
    })
  },
  getByTeamUuid: async (team_uuid: string) => {
    return prisma.accounts.findMany({
      where: {
        team_uuid,
      },
      include: {
        transactions: true,
      },
    })
  },
  update: async (
    uuid: string,
    data: {
      name?: string
      balance?: number
      team_uuid?: string
    },
  ) => {
    return prisma.accounts.update({
      where: {
        uuid,
      },
      data,
      include: {
        transactions: true,
      },
    })
  },
  delete: async (uuid: string) => {
    return prisma.accounts.delete({
      where: {
        uuid,
      },
    })
  },
}
