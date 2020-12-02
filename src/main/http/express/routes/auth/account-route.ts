import { adaptMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeCreateAccountController, makeActiveAccountController, makeRequestRecoverPasswordController, makeRecoverPasswordController, makeSetAccountTypeController, makeShowAccountBySessionController, makeShowAccountByIdController, makeUpdateAccountController } from '@/main/factories/controllers/auth'
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
  accountRouter.put('/', uploadFile.single('avatar_file_path'), adaptMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeUpdateAccountController()))
  accountRouter.put('/:session_id', adaptRoute(makeActiveAccountController()))
  accountRouter.get('/:account_id', adaptMiddleware(makeManagerAuthenticationMiddleware()), adaptRoute(makeShowAccountByIdController()))
  accountRouter.get('/', adaptMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeShowAccountBySessionController()))
  return accountRouter
}
