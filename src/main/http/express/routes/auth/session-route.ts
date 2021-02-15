import { makeAuthenticationAccountRoute, makeLogoutRoute } from '@/main/http/express/routes/auth/session'
import { Router } from 'express'

export default (): Router => {
  const sessionRouter = Router()
  sessionRouter.use(makeAuthenticationAccountRoute())
  sessionRouter.use(makeLogoutRoute())
  return sessionRouter
}
