import { Request, Response, NextFunction } from 'express'
import { transactionsService } from '../services/transactions'
import { handlerResponse } from '../middleware/handler'

/**
 * Middleware interne pour vérifier l'existence d'une transaction.
 */
export const checkTransaction = (mode: 'exists', _source: 'params') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.params
    const transaction = await transactionsService.getById(uuid as string)

    if (mode === 'exists' && !transaction)
      return handlerResponse(res, false, 404, 'Transaction introuvable')

    res.locals.transaction = transaction
    next()
  }
}

export const transactionController = {
  create: async (req: Request, res: Response) => {
    const { account_uuid, type, amount } = req.body
    const transaction = await transactionsService.create(account_uuid, type, amount)
    return handlerResponse(res, true, 201, transaction)
  },
  getAll: async (_req: Request, res: Response) => {
    const transactions = await transactionsService.getAll()
    return handlerResponse(res, true, 200, transactions)
  },
  getById: async (req: Request, res: Response) => {
    const { uuid } = req.params
    const transaction = await transactionsService.getById(uuid as string)
    return handlerResponse(res, true, 200, transaction)
  },
  getByAccountUuid: async (req: Request, res: Response) => {
    const { uuid } = req.params
    const transactions = await transactionsService.getByAccountUuid(uuid as string)
    return handlerResponse(res, true, 200, transactions)
  },
  update: async (req: Request, res: Response) => {
    const { uuid } = req.params
    const { type, amount } = req.body
    const transaction = await transactionsService.update(uuid as string, type, amount)
    return handlerResponse(res, true, 200, transaction)
  },
  delete: async (req: Request, res: Response) => {
    const { uuid } = req.params
    const transaction = await transactionsService.delete(uuid as string)
    return handlerResponse(res, true, 200, transaction)
  },
}
