import { adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController, makeActiveAccountController } from '@/main/factories/controllers/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/account', adaptRoute(makeCreateAccountController()))
  router.get('/account/:session_id', adaptRoute(makeActiveAccountController()))
}
