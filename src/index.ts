import dotenv from 'dotenv'
const env = process.env.NODE_ENV
dotenv.config({ path: `.env.${env}` })

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import route from './routes/index'
import docsRouter from './routes/docs'
import { handlerResponse } from './middleware/handler'

if (env === 'dev') {
  console.log('Development mode')
} else {
  console.log('Production mode')
}

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net',
          'https://fonts.googleapis.com',
        ],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
        'connect-src': ["'self'", 'https://cdn.jsdelivr.net'],
        'worker-src': ["'self'", 'blob:'],
      },
    },
  }),
)
app.use(cors())

app.use(express.json())

app.get('/', (_req, res) => {
  res.redirect('/docs')
})

app.use('/api', route)

app.use('/docs', docsRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  return handlerResponse(res, false, 500, err.message || 'Internal server error')
})
