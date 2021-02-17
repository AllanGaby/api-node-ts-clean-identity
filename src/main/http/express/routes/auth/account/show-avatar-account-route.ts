import { adaptFileRoute } from '@/main/adapters/express'
import { makeShowAvatarAccountController } from '@/main/factories/controllers/auth/account'
import { Router } from 'express'

export const makeShowAvatarAccountRoute = (): Router => {
  const showAvatarRoute = Router()
  showAvatarRoute.get('/avatar/:account_id', adaptFileRoute(makeShowAvatarAccountController(), 'png', 'avatar_file_path'))
  return showAvatarRoute
}
