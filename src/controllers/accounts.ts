import { Request, Response, NextFunction } from 'express'
import { accountsService } from '../services/accounts'
import { handlerResponse } from '../middleware/handler'

export const checkAccount = (mode: 'exists' | 'conflict', source: 'body' | 'params') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const account =
      source === 'body'
        ? req.body.account_uuid
          ? await accountsService.getById(req.body.account_uuid as string)
          : await accountsService.getByNameAndTeam(
              req.body.name as string,
              req.body.team_uuid as string,
            )
        : await accountsService.getById(req.params.uuid as string)

    if (mode === 'exists' && !account) return handlerResponse(res, false, 404, 'Compte introuvable')
    if (mode === 'conflict' && account)
      return handlerResponse(res, false, 400, 'Ce compte existe déjà')

    res.locals.account = account
    next()
  }
}

export const accountsController = {
  create: async (req: Request, res: Response) => {
    const { name, team_uuid } = req.body
    const account = await accountsService.create(name, team_uuid)
    return handlerResponse(res, true, 201, account)
  },
  getAll: async (_req: Request, res: Response) => {
    const accounts = await accountsService.getAll()
    return handlerResponse(res, true, 200, accounts)
  },
  getById: async (req: Request, res: Response) => {
    const { uuid } = req.params
    const account = await accountsService.getById(uuid as string)
    return handlerResponse(res, true, 200, account)
  },
  getByTeamUuid: async (req: Request, res: Response) => {
    const { teamUuid } = req.params
    const accounts = await accountsService.getByTeamUuid(teamUuid as string)
    return handlerResponse(res, true, 200, accounts)
  },
  update: async (req: Request, res: Response) => {
    const { uuid } = req.params
    const account = await accountsService.update(uuid as string, req.body)
    return handlerResponse(res, true, 200, account)
  },
  delete: async (req: Request, res: Response) => {
    const { uuid } = req.params
    const account = await accountsService.delete(uuid as string)
    return handlerResponse(res, true, 200, account)
  },
}
