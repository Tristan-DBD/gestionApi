import { Router } from 'express'
import { accountsController, checkAccount } from '../controllers/accounts'
import { validate } from '../middleware/validate'
import {
  createAccountSchema,
  updateAccountSchema,
  accountUuid,
  teamUuid,
} from '../schemas/accounts'

const router = Router()

router.post(
  '/',
  validate(createAccountSchema, 'body'),
  checkAccount('conflict', 'body'),
  accountsController.create,
)

router.get('/', accountsController.getAll)

router.get(
  '/:uuid',
  validate(accountUuid, 'params'),
  checkAccount('exists', 'params'),
  accountsController.getById,
)

router.get('/team/:teamUuid', validate(teamUuid, 'params'), accountsController.getByTeamUuid)

router.put(
  '/:uuid',
  validate(accountUuid, 'params'),
  validate(updateAccountSchema, 'body'),
  checkAccount('exists', 'params'),
  accountsController.update,
)

router.delete(
  '/:uuid',
  validate(accountUuid, 'params'),
  checkAccount('exists', 'params'),
  accountsController.delete,
)

export default router
