import { registry } from '../registry'
import { authSchema } from '../schemas/auth'

/**
 * Déclaration OpenAPI pour l'authentification.
 */
registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  summary: 'Se connecter à une équipe',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Connexion réussie',
      content: {
        'application/json': {
          schema: authSchema,
        },
      },
    },
  },
})
