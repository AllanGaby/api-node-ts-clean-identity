import { adaptRoute } from '@/main/adapters/express'
import { makeRecoverPasswordController } from '@/main/factories/controllers/auth/account'
import { Router } from 'express'

export const makeRecoverPasswordRoute = (): Router => {
  return Router().put('/password', adaptRoute(makeRecoverPasswordController()))
}
