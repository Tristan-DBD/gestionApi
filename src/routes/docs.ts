import { Router } from 'express'
import { apiReference } from '@scalar/express-api-reference'
import { getOpenApiDocumentation } from '../openapi'

const router = Router()
const docs = getOpenApiDocumentation()

// Endpoint pour le JSON OpenAPI
router.get('/openapi.json', (_req, res) => {
  res.json(docs)
})

// Page HTML Scalar (Interactive) - Utilise le package local
router.use(
  '/',
  apiReference({
    spec: {
      content: docs,
    },
    theme: 'deepSpace',
    showSidebar: true,
  } as any),
)

export default router
