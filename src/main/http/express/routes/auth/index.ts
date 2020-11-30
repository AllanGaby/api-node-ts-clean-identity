import { Router } from 'express'
import accountRouter from './account-route'
import sessionRouter from './session-route'

export default (): Router => {
  const authRouter = Router()
  authRouter.use('/account', accountRouter())
  authRouter.use('/session', sessionRouter())
  return authRouter
}
