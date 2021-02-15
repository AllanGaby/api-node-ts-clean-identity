import { adaptRoute } from '@/main/adapters/express'
import { makeAuthenticationAccountController } from '@/main/factories/controllers/auth/session'
import { Router } from 'express'

export const makeAuthenticationAccountRoute = (): Router => {
  return Router().post('/', adaptRoute(makeAuthenticationAccountController()))
}
