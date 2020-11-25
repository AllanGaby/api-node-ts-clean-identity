import { adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController, makeActiveAccountController, makeAuthenticationAccountController, makeListAccountController, makeRequestRecoverPasswordController, makeRecoverPasswordController } from '@/main/factories/controllers/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/account', adaptRoute(makeCreateAccountController()))
  router.get('/account/:session_id', adaptRoute(makeActiveAccountController()))
  router.post('/account/login', adaptRoute(makeAuthenticationAccountController()))
  router.get('/account', adaptRoute(makeListAccountController()))
  router.post('/account/password', adaptRoute(makeRequestRecoverPasswordController()))
  router.put('/account/password', adaptRoute(makeRecoverPasswordController()))
}
