import { adaptMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController, makeActiveAccountController, makeAuthenticationAccountController, makeListAccountController, makeRequestRecoverPasswordController, makeRecoverPasswordController, makeSetAccountTypeController, makeShowAccountController } from '@/main/factories/controllers/auth'
import { makeManagerAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/account', adaptRoute(makeCreateAccountController()))
  router.get('/account/:session_id', adaptRoute(makeActiveAccountController()))
  router.post('/account/login', adaptRoute(makeAuthenticationAccountController()))
  router.get('/account', adaptMiddleware(makeManagerAuthenticationMiddleware()), adaptRoute(makeListAccountController()))
  router.post('/account/password', adaptRoute(makeRequestRecoverPasswordController()))
  router.put('/account/password', adaptRoute(makeRecoverPasswordController()))
  router.put('/account/type', adaptRoute(makeSetAccountTypeController()))
  router.get('/account/:account_id', adaptMiddleware(makeManagerAuthenticationMiddleware()), adaptRoute(makeShowAccountController()))
}
