import { adaptAuthenticationMiddleware, adaptFileRoute, adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController, makeActiveAccountController, makeRequestRecoverPasswordController, makeRecoverPasswordController, makeShowAccountBySessionController, makeUpdateAccountController, makeUploadAvatarAccountController, makeShowAvatarAccountController } from '@/main/factories/controllers/auth/account'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@/main/config/multer/config'

export default (): Router => {
  const uploadFile = multer(uploadConfig)
  const accountRouter = Router()
  accountRouter.post('/', adaptRoute(makeCreateAccountController()))
  accountRouter.post('/password', adaptRoute(makeRequestRecoverPasswordController()))
  accountRouter.put('/password', adaptRoute(makeRecoverPasswordController()))
  accountRouter.put('/', uploadFile.single('avatar_file_path'), adaptAuthenticationMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeUpdateAccountController(), 'avatar_file_path'))
  accountRouter.patch('/avatar', uploadFile.single('avatar_file_path'), adaptAuthenticationMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeUploadAvatarAccountController(), 'avatar_file_path'))
  accountRouter.put('/:session_id', adaptRoute(makeActiveAccountController()))
  accountRouter.get('/avatar/:file_id', adaptAuthenticationMiddleware(makeAuthenticationMiddleware()), adaptFileRoute(makeShowAvatarAccountController(), 'png', 'avatar_file_path'))
  accountRouter.get('/', adaptAuthenticationMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeShowAccountBySessionController()))
  return accountRouter
}
