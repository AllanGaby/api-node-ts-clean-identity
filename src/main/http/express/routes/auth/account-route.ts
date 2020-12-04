import { adaptMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController, makeActiveAccountController, makeRequestRecoverPasswordController, makeRecoverPasswordController, makeSetAccountTypeController, makeShowAccountBySessionController, makeUpdateAccountController, makeShowAvatarAccountBySessionController } from '@/main/factories/controllers/auth'
import { makeManagerAuthenticationMiddleware, makeAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@/main/config/multer/config'

export default (): Router => {
  const uploadFile = multer(uploadConfig)
  const accountRouter = Router()
  accountRouter.post('/', adaptRoute(makeCreateAccountController()))
  accountRouter.post('/password', adaptRoute(makeRequestRecoverPasswordController()))
  accountRouter.put('/password', adaptRoute(makeRecoverPasswordController()))
  accountRouter.put('/type', adaptMiddleware(makeManagerAuthenticationMiddleware()), adaptRoute(makeSetAccountTypeController()))
  accountRouter.put('/', uploadFile.single('avatar_file_path'), adaptMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeUpdateAccountController(), 'avatar_file_path'))
  accountRouter.put('/:session_id', adaptRoute(makeActiveAccountController()))
  accountRouter.get('/', adaptMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeShowAccountBySessionController()))
  accountRouter.get('/avatar', adaptMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeShowAvatarAccountBySessionController()))
  return accountRouter
}
