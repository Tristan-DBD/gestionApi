import { registry } from '../registry'
import {
  createTeamSchema,
  updateTeamSchema,
  getTeamSchema,
  getByIdTeamSchema,
} from '../schemas/teams'

registry.registerPath({
  method: 'post',
  path: '/api/teams',
  tags: ['Teams'],
  summary: 'Crée une nouvelle équipe',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createTeamSchema,
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'Équipe créée avec succès',
      content: {
        'application/json': {
          schema: getTeamSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'get',
  path: '/api/teams',
  tags: ['Teams'],
  summary: 'Récupère toutes les équipes',
  responses: {
    '200': {
      description: 'Équipes récupérées avec succès',
      content: {
        'application/json': {
          schema: getTeamSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'get',
  path: '/api/teams/{uuid}',
  tags: ['Teams'],
  summary: 'Récupère une équipe par son UUID',
  parameters: [
    {
      name: 'uuid',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Équipe récupérée avec succès',
      content: {
        'application/json': {
          schema: getTeamSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'put',
  path: '/api/teams/{uuid}',
  tags: ['Teams'],
  summary: 'Met à jour une équipe par son UUID',
  parameters: [
    {
      name: 'uuid',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
      },
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateTeamSchema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Équipe mise à jour avec succès',
      content: {
        'application/json': {
          schema: getTeamSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'delete',
  path: '/api/teams/{uuid}',
  tags: ['Teams'],
  summary: 'Supprime une équipe par son UUID',
  parameters: [
    {
      name: 'uuid',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Équipe supprimée avec succès',
      content: {
        'application/json': {
          schema: getByIdTeamSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})
