import { Request, Response } from 'express'
import { authService } from '../services/auth'
import { handlerResponse } from '../middleware/handler'

export const authController = {
  async login(req: Request, res: Response) {
    const { name, pin } = req.body
    const result = await authService.login(name as string, pin as string)
    return handlerResponse(res, result.success, result.status, result.data || result.message)
  },
}
