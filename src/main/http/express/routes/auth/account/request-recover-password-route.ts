import { adaptRoute } from '@/main/adapters/express'
import { makeRequestRecoverPasswordController } from '@/main/factories/controllers/auth/account'
import { Router } from 'express'

export const makeRequestRecoverPasswordRoute = (): Router => {
  return Router().post('/password', adaptRoute(makeRequestRecoverPasswordController()))
}
