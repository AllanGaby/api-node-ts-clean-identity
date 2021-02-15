import { adaptAuthenticationMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeUpdateAccountController } from '@/main/factories/controllers/auth/account'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'

export const makeUpdateAccountRoute = (): Router => {
  return Router().put('/', adaptAuthenticationMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeUpdateAccountController()))
}
