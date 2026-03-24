import { TransactionType } from '@prisma/client'
import prisma from '../config/db'

export const transactionsService = {
  async create(accountUuid: string, type: TransactionType, amount: number) {
    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transactions.create({
        data: {
          account_uuid: accountUuid,
          type,
          amount,
        },
      })

      // Update account balance
      if (type === 'DEFINE') {
        await tx.accounts.update({
          where: { uuid: accountUuid },
          data: { balance: amount },
        })
      } else {
        const adjustment = type === 'WITHDRAW' ? -amount : amount
        await tx.accounts.update({
          where: { uuid: accountUuid },
          data: { balance: { increment: adjustment } },
        })
      }

      return transaction
    })
  },

  async getAll() {
    return await prisma.transactions.findMany({
      orderBy: { created_at: 'desc' },
    })
  },

  async getById(uuid: string) {
    return await prisma.transactions.findUnique({
      where: { uuid },
    })
  },

  async getByAccountUuid(accountUuid: string) {
    return await prisma.transactions.findMany({
      where: { account_uuid: accountUuid },
      orderBy: { created_at: 'desc' },
    })
  },

  async update(uuid: string, type: TransactionType, amount: number) {
    return await prisma.$transaction(async (tx) => {
      const oldTransaction = await tx.transactions.findUniqueOrThrow({
        where: { uuid },
      })

      const transaction = await tx.transactions.update({
        where: { uuid },
        data: { type, amount },
      })

      // Update account balance
      if (type === 'DEFINE') {
        // If the new type is DEFINE, we just set the balance to the new amount
        await tx.accounts.update({
          where: { uuid: oldTransaction.account_uuid },
          data: { balance: amount },
        })
      } else if (oldTransaction.type === 'DEFINE') {
        // If we change from DEFINE to another type, we apply the new adjustment to the current balance
        // because we can't easily "revert" a DEFINE to a previous unknown state.
        const newAdjustment = type === 'WITHDRAW' ? -amount : amount
        await tx.accounts.update({
          where: { uuid: oldTransaction.account_uuid },
          data: { balance: { increment: newAdjustment } },
        })
      } else {
        // Revert old transaction impact (for non-DEFINE types)
        const oldAdjustment =
          oldTransaction.type === 'WITHDRAW' ? -oldTransaction.amount : oldTransaction.amount

        // Apply new transaction impact
        const newAdjustment = type === 'WITHDRAW' ? -amount : amount

        const totalAdjustment = newAdjustment - oldAdjustment

        await tx.accounts.update({
          where: { uuid: oldTransaction.account_uuid },
          data: { balance: { increment: totalAdjustment } },
        })
      }

      return transaction
    })
  },

  async delete(uuid: string) {
    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transactions.findUniqueOrThrow({
        where: { uuid },
      })

      await tx.transactions.delete({
        where: { uuid },
      })

      // Update account balance
      if (transaction.type !== 'DEFINE') {
        const adjustment =
          transaction.type === 'WITHDRAW' ? transaction.amount : -transaction.amount

        await tx.accounts.update({
          where: { uuid: transaction.account_uuid },
          data: { balance: { increment: adjustment } },
        })
      }

      return transaction
    })
  },
}
