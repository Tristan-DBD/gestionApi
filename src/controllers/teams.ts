import { Request, Response, NextFunction } from 'express'
import { teamsService } from '../services/teams'
import { handlerResponse } from '../middleware/handler'

/**
 * Middleware interne pour vérifier l'existence ou le conflit d'une équipe.
 */
export const checkTeam = (mode: 'exists' | 'conflict', source: 'body' | 'params') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = source === 'body' ? req.body.name : req.params.uuid
    const team =
      source === 'body'
        ? await teamsService.getByName(identifier as string)
        : await teamsService.getById(identifier as string)

    if (mode === 'exists' && !team) return handlerResponse(res, false, 404, 'Équipe introuvable')
    if (mode === 'conflict' && team)
      return handlerResponse(res, false, 400, 'Cette équipe existe déjà')

    res.locals.team = team
    next()
  }
}

export const teamsController = {
  async create(req: Request, res: Response) {
    const { name, pin } = req.body
    const team = await teamsService.create(name, pin)
    return handlerResponse(res, true, 201, team)
  },

  async getAll(_req: Request, res: Response) {
    const teams = await teamsService.getAll()
    return handlerResponse(res, true, 200, teams)
  },

  async getById(req: Request, res: Response) {
    const { uuid } = req.params
    const team = await teamsService.getById(uuid as string)
    return handlerResponse(res, true, 200, team)
  },

  async update(req: Request, res: Response) {
    const { uuid } = req.params
    const { pin } = req.body
    const team = await teamsService.update(uuid as string, pin)
    return handlerResponse(res, true, 200, team)
  },

  async delete(req: Request, res: Response) {
    const { uuid } = req.params
    const team = await teamsService.delete(uuid as string)
    return handlerResponse(res, true, 200, team)
  },
}
