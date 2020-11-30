import { adaptMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController, makeActiveAccountController, makeListAccountController, makeRequestRecoverPasswordController, makeRecoverPasswordController, makeSetAccountTypeController, makeShowAccountController } from '@/main/factories/controllers/auth'
import { makeManagerAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'

export default (): Router => {
  const accountRouter = Router()
  accountRouter.post('/', adaptRoute(makeCreateAccountController()))
  accountRouter.post('/password', adaptRoute(makeRequestRecoverPasswordController()))
  accountRouter.put('/password', adaptRoute(makeRecoverPasswordController()))
  accountRouter.put('/type', adaptRoute(makeSetAccountTypeController()))
  accountRouter.put('/:session_id', adaptRoute(makeActiveAccountController()))
  accountRouter.get('/', adaptMiddleware(makeManagerAuthenticationMiddleware()), adaptRoute(makeListAccountController()))
  accountRouter.get('/:account_id', adaptMiddleware(makeManagerAuthenticationMiddleware()), adaptRoute(makeShowAccountController()))
  return accountRouter
}
