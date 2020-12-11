import { accountModelSchema, createAccountRequestSchema, recoverPasswordSchema, requestRecoverPasswordSchema, updateAccountRequestSchema, setAccountTypeSchema } from './account'
import { authenticationRequestSchema, authenticationResponseSchema, sessionModelSchema } from './session'

export default {
  authenticationRequest: authenticationRequestSchema,
  authenticationResponse: authenticationResponseSchema,
  createAccountRequest: createAccountRequestSchema,
  sessionModel: sessionModelSchema,
  accountModel: accountModelSchema,
  requestRecoverPassword: requestRecoverPasswordSchema,
  recoverPassword: recoverPasswordSchema,
  updateAccountRequest: updateAccountRequestSchema,
  setAccountType: setAccountTypeSchema
}
