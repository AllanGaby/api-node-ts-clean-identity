import { accountPath, activeAccountPath } from './account'
import { authenticationPath } from './session'

export default {
  '/auth/session': authenticationPath,
  '/auth/account': accountPath,
  '/auth/account/{session_id}': activeAccountPath
}
