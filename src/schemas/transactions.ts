import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

// Étendre Zod avec les méthodes OpenAPI
extendZodWithOpenApi(z)

// Schéma de base pour une transaction
export const transactionsSchema = z.object({
  account_uuid: z.uuid({ message: "L'UUID du compte doit être valide" }).openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifiant unique du compte associé',
  }),
  type: z
    .enum(['DEPOSIT', 'WITHDRAW', 'DEFINE'], {
      error: 'Le type de transaction doit être DEPOSIT, WITHDRAW ou DEFINE',
    })
    .openapi({ example: 'DEPOSIT', description: 'Type de la transaction' }),
  amount: z
    .number({ message: 'Le montant doit être un nombre' })
    .positive({ message: 'Le montant doit être positif' })
    .openapi({ example: 100.5, description: 'Montant de la transaction' }),
})

// Schéma incluant l'ID et la date (utile pour Get)
export const transactionsWithIdSchema = transactionsSchema.extend({
  uuid: z.uuid({ message: "L'UUID doit être valide" }).openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifiant unique de la transaction',
  }),
  created_at: z.date().openapi({ description: 'Date de création de la transaction' }),
})

// Schémas pour les différentes opérations
export const createTransactionSchema = transactionsSchema
export const getByIdTransactionSchema = z.object({
  uuid: z.uuid({ message: "L'UUID doit être valide" }).openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifiant unique de la transaction',
  }),
})

export const getByAccountUuidTransactionSchema = z.object({
  account_uuid: z.uuid({ message: "L'UUID du compte doit être valide" }).openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifiant unique du compte pour filtrer',
  }),
})

export const updateTransactionSchema = transactionsSchema.omit({ account_uuid: true })
export const deleteTransactionSchema = getByIdTransactionSchema

// Types exportés
export type TransactionSchema = z.infer<typeof transactionsSchema>
export type TransactionWithIdSchema = z.infer<typeof transactionsWithIdSchema>
export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>
export type GetByIdTransactionSchema = z.infer<typeof getByIdTransactionSchema>
export type GetByAccountUuidTransactionSchema = z.infer<typeof getByAccountUuidTransactionSchema>
export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>
export type DeleteTransactionSchema = z.infer<typeof deleteTransactionSchema>
