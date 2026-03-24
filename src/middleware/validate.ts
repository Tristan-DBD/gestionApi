import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'
import { handlerResponse } from './handler'

/**
 * Middleware pour valider le corps d'une requête Express avec Zod.
 */
export const validate = (schema: ZodSchema<any>, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req[source])
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return handlerResponse(
          res,
          false,
          400,
          error.issues.map((issue) => issue.message),
        )
      }
      return handlerResponse(res, false, 500, 'Erreur interne')
    }
  }
}
