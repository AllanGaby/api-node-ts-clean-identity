import { adaptAuthenticationMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeShowAccountBySessionController } from '@/main/factories/controllers/auth/account'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'

export const makeShowAccountBySessionRoute = (): Router => {
  return Router().get('/', adaptAuthenticationMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeShowAccountBySessionController()))
}
