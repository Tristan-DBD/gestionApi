import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import { registry } from './registry'

/**
 * IMPORTATION DES DOCUMENTS (DOCS)
 * On importe les déclarations pour qu'elles s'enregistrent dans le `registry`.
 */
import './docs/auth'
import './docs/teams'
import './docs/accounts'
import './docs/transactions'

/**
 * Fonction pour générer le document OpenAPI final.
 */
export function getOpenApiDocumentation() {
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Gestion Trésorerie API',
      version: '1.0.0',
      description: 'API de gestion de trésorerie pour la caserne.',
    },
    servers: [{ url: 'http://localhost:4000', description: 'Serveur de Développement' }],
    security: [{ bearerAuth: [] }],
  })
}
