import { accountPath, activeAccountPath, showAvatarAccountPath, recoverPasswordPath, avatarAccountPath } from './account'
import { authenticationPath } from './session'

export default {
  '/auth/session': authenticationPath,
  '/auth/account': accountPath,
  '/auth/account/active/{session_id}': activeAccountPath,
  '/auth/account/avatar/{avatar_id}': showAvatarAccountPath,
  '/auth/account/avatar': avatarAccountPath,
  '/auth/account/password': recoverPasswordPath
}
