import { adaptRoute } from '@/main/adapters/express'
import { makeAuthenticationAccountController } from '@/main/factories/controllers/auth'
import { Router } from 'express'

export default (): Router => {
  const sessionRouter = Router()
  sessionRouter.post('/', adaptRoute(makeAuthenticationAccountController()))
  return sessionRouter
}
