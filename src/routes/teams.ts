import { Router } from 'express'
import { teamsController, checkTeam } from '../controllers/teams'
import { validate } from '../middleware/validate'
import { createTeamSchema, updateTeamSchema, getByIdTeamSchema } from '../schemas/teams'

const router = Router()

router.post('/', validate(createTeamSchema), checkTeam('conflict', 'body'), teamsController.create)

router.get('/', teamsController.getAll)

router.get(
  '/:uuid',
  validate(getByIdTeamSchema, 'params'),
  checkTeam('exists', 'params'),
  teamsController.getById,
)

router.put(
  '/:uuid',
  validate(getByIdTeamSchema, 'params'),
  validate(updateTeamSchema, 'body'),
  checkTeam('exists', 'params'),
  teamsController.update,
)

router.delete(
  '/:uuid',
  validate(getByIdTeamSchema, 'params'),
  checkTeam('exists', 'params'),
  teamsController.delete,
)

export default router
