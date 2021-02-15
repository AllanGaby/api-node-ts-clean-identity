import { adaptRoute, adaptAuthenticationMiddleware } from '@/main/adapters/express'
import { makeLogoutController } from '@/main/factories/controllers/auth/session'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'

export const makeLogoutRoute = (): Router => {
  return Router().delete('/', adaptAuthenticationMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeLogoutController()))
}
