import { authenticationPath } from '@/main/docs/paths/auth/session'
import { accountPath, activeAccountPath } from '@/main/docs/paths/auth/account'

export default {
  '/auth/session': authenticationPath,
  '/auth/account': accountPath,
  '/auth/account/{session_id}': activeAccountPath
}
