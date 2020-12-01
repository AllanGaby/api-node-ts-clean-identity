import { adaptMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController, makeActiveAccountController, makeRequestRecoverPasswordController, makeRecoverPasswordController, makeSetAccountTypeController, makeShowAccountController } from '@/main/factories/controllers/auth'
import { makeManagerAuthenticationMiddleware, makeAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'

export default (): Router => {
  const accountRouter = Router()
  accountRouter.post('/', adaptRoute(makeCreateAccountController()))
  accountRouter.post('/password', adaptRoute(makeRequestRecoverPasswordController()))
  accountRouter.put('/password', adaptRoute(makeRecoverPasswordController()))
  accountRouter.put('/type', adaptMiddleware(makeManagerAuthenticationMiddleware()), adaptRoute(makeSetAccountTypeController()))
  accountRouter.put('/:session_id', adaptRoute(makeActiveAccountController()))
  accountRouter.get('/', adaptMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeShowAccountController()))
  return accountRouter
}
