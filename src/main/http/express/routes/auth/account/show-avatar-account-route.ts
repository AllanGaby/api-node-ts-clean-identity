import { adaptFileRoute } from '@/main/adapters/express'
import { makeShowAvatarAccountController } from '@/main/factories/controllers/auth/account'
import { Router } from 'express'

export const makeShowAvatarAccountRoute = (): Router => {
  return Router().get('/avatar/:avatar_id', adaptFileRoute(makeShowAvatarAccountController(), 'png', 'avatar_file_path'))
}
