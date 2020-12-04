import { adaptRoute, adaptMiddleware } from '@/main/adapters/express'
import { makeAuthenticationAccountController, makeLogoutController } from '@/main/factories/controllers/auth/session'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'

export default (): Router => {
  const sessionRouter = Router()
  sessionRouter.post('/', adaptRoute(makeAuthenticationAccountController()))
  sessionRouter.delete('/', adaptMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeLogoutController()))
  return sessionRouter
}
