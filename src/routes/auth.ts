import { Router } from 'express'
import { authController } from '../controllers/auth'
import { validate } from '../middleware/validate'
import { loginSchema } from '../schemas/auth'

const router = Router()

router.post('/login', validate(loginSchema, 'body'), authController.login)

export default router
