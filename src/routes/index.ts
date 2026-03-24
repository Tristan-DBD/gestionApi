import { Router } from 'express'
import teamsRouter from './teams'
import authRouter from './auth'
import accountsRouter from './accounts'
import transactionsRouter from './transactions'

const router = Router()

router.use('/teams', teamsRouter)
router.use('/auth', authRouter)
router.use('/accounts', accountsRouter)
router.use('/transactions', transactionsRouter)

export default router
