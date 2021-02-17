import { makeActiveAccountRoute, makeCreateAccountRoute, makeRequestRecoverPasswordRoute, makeRecoverPasswordRoute, makeUpdateAccountRoute, makeUploadAvatarAccountRoute, makeShowAvatarAccountRoute, makeShowAccountBySessionRoute, makeDeleteAvatarAccountRoute } from '@/main/http/express/routes/auth/account'
import { Router } from 'express'

export default (): Router => {
  const accountRouter = Router()
  accountRouter.use(makeActiveAccountRoute())
  accountRouter.use(makeCreateAccountRoute())
  accountRouter.use(makeDeleteAvatarAccountRoute())
  accountRouter.use(makeRecoverPasswordRoute())
  accountRouter.use(makeRequestRecoverPasswordRoute())
  accountRouter.use(makeShowAccountBySessionRoute())
  accountRouter.use(makeShowAvatarAccountRoute())
  accountRouter.use(makeUpdateAccountRoute())
  accountRouter.use(makeUploadAvatarAccountRoute())
  return accountRouter
}
