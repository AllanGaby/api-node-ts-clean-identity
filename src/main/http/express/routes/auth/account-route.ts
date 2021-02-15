import { makeActiveAccountRoute, makeCreateAccountRoute, makeRequestRecoverPasswordRoute, makeRecoverPasswordRoute, makeUpdateAccountRoute, makeUploadAvatarAccountRoute, makeShowAvatarAccountRoute, makeShowAccountBySessionRoute } from '@/main/http/express/routes/auth/account'
import { Router } from 'express'

export default (): Router => {
  const accountRouter = Router()
  accountRouter.use(makeCreateAccountRoute())
  accountRouter.use(makeRequestRecoverPasswordRoute())
  accountRouter.use(makeRecoverPasswordRoute())
  accountRouter.use(makeUpdateAccountRoute())
  accountRouter.use(makeUploadAvatarAccountRoute())
  accountRouter.use(makeActiveAccountRoute())
  accountRouter.use(makeShowAvatarAccountRoute())
  accountRouter.use(makeShowAccountBySessionRoute())
  return accountRouter
}
