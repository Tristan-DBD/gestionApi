import { registry } from '../registry'
import {
  createTransactionSchema,
  updateTransactionSchema,
  getByIdTransactionSchema,
} from '../schemas/transactions'

registry.registerPath({
  method: 'post',
  path: '/api/transactions',
  tags: ['Transactions'],
  summary: 'Crée une nouvelle transaction',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createTransactionSchema,
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'Transaction créée avec succès',
      content: {
        'application/json': {
          schema: getByIdTransactionSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'get',
  path: '/api/transactions',
  tags: ['Transactions'],
  summary: 'Récupère toutes les transactions',
  responses: {
    '200': {
      description: 'Transactions récupérées avec succès',
      content: {
        'application/json': {
          schema: getByIdTransactionSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'get',
  path: '/api/transactions/{uuid}',
  tags: ['Transactions'],
  summary: 'Récupère une transaction par son UUID',
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
      description: 'Transaction récupérée avec succès',
      content: {
        'application/json': {
          schema: getByIdTransactionSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'get',
  path: '/api/transactions/account/{uuid}',
  tags: ['Transactions'],
  summary: 'Récupère les transactions par compte UUID',
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
      description: 'Transactions récupérées avec succès',
      content: {
        'application/json': {
          schema: getByIdTransactionSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'put',
  path: '/api/transactions/{uuid}',
  tags: ['Transactions'],
  summary: 'Met à jour une transaction par son UUID',
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
          schema: updateTransactionSchema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Transaction mise à jour avec succès',
      content: {
        'application/json': {
          schema: getByIdTransactionSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})

registry.registerPath({
  method: 'delete',
  path: '/api/transactions/{uuid}',
  tags: ['Transactions'],
  summary: 'Supprime une transaction par son UUID',
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
      description: 'Transaction supprimée avec succès',
      content: {
        'application/json': {
          schema: getByIdTransactionSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
})
