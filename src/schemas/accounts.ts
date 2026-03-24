import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

// Étendre Zod avec les méthodes OpenAPI
extendZodWithOpenApi(z)

export const accountSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(20, 'Le nom doit contenir au plus 20 caractères'),
  team_uuid: z.string().uuid("L'UUID de l'équipe doit être valide"),
  balance: z.number().default(0),
})

export type AccountSchema = z.infer<typeof accountSchema>

export const accountUuid = z.object({
  uuid: z.string().uuid("L'UUID doit être valide").openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: "Identifiant unique de l'équipe",
  }),
})

export const teamUuid = z.object({
  teamUuid: z.string().uuid("L'UUID de l'équipe doit être valide"),
})

export const accountWithIdSchema = accountSchema.merge(accountUuid)

export const createAccountSchema = accountSchema
export const updateAccountSchema = accountSchema.partial()
export const deleteAccountSchema = accountUuid

export type CreateAccountSchema = z.infer<typeof createAccountSchema>
export type GetAccountSchema = z.infer<typeof accountWithIdSchema>
export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>
