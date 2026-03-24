import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

// Étendre Zod avec les méthodes OpenAPI
extendZodWithOpenApi(z)

// Schéma de base pour une équipe
export const teamSchema = z.object({
  name: z
    .enum(['A', 'B', 'C'] as const, {
      error: "Le nom de l'équipe doit être A, B ou C",
    })
    .openapi({ example: 'A', description: "Nom de l'équipe" }),
  pin: z
    .string()
    .length(4, { message: 'Le code PIN doit contenir 4 chiffres' })
    .regex(/^\d+$/, 'Le code PIN ne doit contenir que des chiffres')
    .openapi({ example: '1234', description: "Code PIN d'accès" }),
})

// Type TypeScript extrait
export type TeamSchema = z.infer<typeof teamSchema>

// Schéma incluant l'UUID (utile pour Get, Update, Delete)
export const teamWithIdSchema = teamSchema.extend({
  uuid: z.uuid({ message: "L'UUID doit être valide" }).openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: "Identifiant unique de l'équipe",
  }),
})

export const getByIdTeamSchema = z.object({
  uuid: z.uuid({ message: "L'UUID doit être valide" }).openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: "Identifiant unique de l'équipe",
  }),
})

// Réutilisation du schéma pour les différentes opérations
export const createTeamSchema = teamSchema
export const getTeamSchema = teamWithIdSchema
export const updateTeamSchema = teamSchema.omit({ name: true })
export const deleteTeamSchema = teamWithIdSchema

// Types exportés
export type CreateTeamSchema = z.infer<typeof createTeamSchema>
export type GetTeamSchema = z.infer<typeof getByIdTeamSchema>
export type UpdateTeamSchema = z.infer<typeof updateTeamSchema>
export type DeleteTeamSchema = z.infer<typeof deleteTeamSchema>
