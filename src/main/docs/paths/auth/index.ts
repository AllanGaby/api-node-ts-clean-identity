import { accountPath, activeAccountPath, showAvatarAccountPath } from './account'
import { authenticationPath } from './session'

export default {
  '/auth/session': authenticationPath,
  '/auth/account': accountPath,
  '/auth/account/{session_id}': activeAccountPath,
  '/auth/account/avatar': showAvatarAccountPath
}
