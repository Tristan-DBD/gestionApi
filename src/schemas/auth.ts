import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

// Étendre Zod avec les méthodes OpenAPI
extendZodWithOpenApi(z)

export const authSchema = z.object({
  name: z.enum(['A', 'B', 'C']).openapi({ example: 'A', description: "Nom de l'équipe" }),
  pin: z
    .string()
    .length(4, 'Le code PIN doit contenir 4 chiffres')
    .regex(/^\d+$/, 'Le code PIN doit contenir que des chiffres')
    .openapi({ example: '1234', description: "Code PIN d'accès" }),
})

export type AuthSchema = z.infer<typeof authSchema>

export const loginSchema = authSchema
export type LoginSchema = z.infer<typeof loginSchema>
