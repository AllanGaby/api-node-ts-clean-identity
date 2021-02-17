import { adaptAuthenticationMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeDeleteAvatarAccountController } from '@/main/factories/controllers/auth/account'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'

export const makeDeleteAvatarAccountRoute = (): Router => {
  return Router().delete('/avatar', adaptAuthenticationMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeDeleteAvatarAccountController()))
}
