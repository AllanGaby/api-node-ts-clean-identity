import { accountModelSchema, createAccountRequestSchema } from './account'
import { authenticationRequestSchema, authenticationResponseSchema, sessionModelSchema } from './session'

export default {
  authenticationRequest: authenticationRequestSchema,
  authenticationResponse: authenticationResponseSchema,
  createAccountRequest: createAccountRequestSchema,
  sessionModel: sessionModelSchema,
  accountModel: accountModelSchema
}
