import { registry } from '../registry'
import { accountSchema, createAccountSchema, updateAccountSchema } from '../schemas/accounts'

registry.registerPath({
  method: 'post',
  path: '/api/accounts',
  tags: ['Accounts'],
  summary: 'Créer un nouveau compte',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createAccountSchema,
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'Compte créé avec succès',
      content: {
        'application/json': {
          schema: accountSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'get',
  path: '/api/accounts',
  tags: ['Accounts'],
  summary: 'Récupérer tous les comptes',
  responses: {
    '200': {
      description: 'Comptes récupérés avec succès',
      content: {
        'application/json': {
          schema: accountSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'get',
  path: '/api/accounts/{uuid}',
  tags: ['Accounts'],
  summary: 'Récupérer un compte par son UUID',
  parameters: [
    {
      name: 'uuid',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Compte récupéré avec succès',
      content: {
        'application/json': {
          schema: accountSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'get',
  path: '/api/accounts/team/{teamUuid}',
  tags: ['Accounts'],
  summary: "Récupérer les comptes d'une équipe",
  parameters: [
    {
      name: 'teamUuid',
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
      description: 'Comptes récupérés avec succès',
      content: {
        'application/json': {
          schema: accountSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'put',
  path: '/api/accounts/{uuid}',
  tags: ['Accounts'],
  summary: 'Mettre à jour un compte',
  parameters: [
    {
      name: 'uuid',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateAccountSchema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Compte mis à jour avec succès',
      content: {
        'application/json': {
          schema: accountSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'delete',
  path: '/api/accounts/{uuid}',
  tags: ['Accounts'],
  summary: 'Supprimer un compte',
  parameters: [
    {
      name: 'uuid',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Compte supprimé avec succès',
      content: {
        'application/json': {
          schema: accountSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})
