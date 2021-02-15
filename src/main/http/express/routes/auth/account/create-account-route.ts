import { adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController } from '@/main/factories/controllers/auth/account'
import { Router } from 'express'

export const makeCreateAccountRoute = (): Router => {
  return Router().post('/', adaptRoute(makeCreateAccountController()))
}
