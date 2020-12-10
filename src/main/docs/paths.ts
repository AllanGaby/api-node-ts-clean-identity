import { authenticationPath } from '@/main/docs/paths/auth/session'
import { createAccountPath } from '@/main/docs/paths/auth/account'

export default {
  '/auth/session': authenticationPath,
  '/auth/account': createAccountPath
}
