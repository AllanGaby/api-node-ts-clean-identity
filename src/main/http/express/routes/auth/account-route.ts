import { adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController } from '@/main/factories/controllers/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/account', adaptRoute(makeCreateAccountController()))
}
