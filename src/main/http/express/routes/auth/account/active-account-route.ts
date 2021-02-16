import { adaptRoute } from '@/main/adapters/express'
import { makeActiveAccountController } from '@/main/factories/controllers/auth/account'
import { Router } from 'express'

export const makeActiveAccountRoute = (): Router => {
  return Router().put('/active/:session_id', adaptRoute(makeActiveAccountController()))
}
