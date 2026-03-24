import { Router } from 'express'
import { validate } from '../middleware/validate'
import {
  createTransactionSchema,
  getByIdTransactionSchema,
  getByAccountUuidTransactionSchema,
  updateTransactionSchema,
} from '../schemas/transactions'
import { transactionController, checkTransaction } from '../controllers/transactions'
import { checkAccount } from '../controllers/accounts'

const router = Router()

router.post(
  '/',
  validate(createTransactionSchema, 'body'),
  checkAccount('exists', 'body'),
  transactionController.create,
)

router.get('/', transactionController.getAll)

router.get(
  '/:uuid',
  validate(getByIdTransactionSchema, 'params'),
  checkTransaction('exists', 'params'),
  transactionController.getById,
)

router.get(
  '/account/:uuid',
  validate(getByAccountUuidTransactionSchema, 'params'),
  checkAccount('exists', 'params'),
  transactionController.getByAccountUuid,
)

router.put(
  '/:uuid',
  validate(getByIdTransactionSchema, 'params'),
  validate(updateTransactionSchema, 'body'),
  checkTransaction('exists', 'params'),
  transactionController.update,
)

router.delete(
  '/:uuid',
  validate(getByIdTransactionSchema, 'params'),
  checkTransaction('exists', 'params'),
  transactionController.delete,
)

export default router
