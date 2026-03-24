import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

/**
 * Le Registre unique pour toute l'API.
 * Séparé dans ce fichier pour éviter les dépendances circulaires.
 */
export const registry = new OpenAPIRegistry()

// Définir le schéma d'authentification Bearer
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})
