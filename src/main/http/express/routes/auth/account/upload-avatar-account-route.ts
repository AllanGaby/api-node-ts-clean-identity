import { adaptAuthenticationMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeUploadAvatarAccountController } from '@/main/factories/controllers/auth/account'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares/auth'
import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@/main/config/multer/config'

export const makeUploadAvatarAccountRoute = (): Router => {
  const uploadFile = multer(uploadConfig)
  return Router().patch('/avatar', uploadFile.single('avatar_file_path'), adaptAuthenticationMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeUploadAvatarAccountController(), 'avatar_file_path'))
}
