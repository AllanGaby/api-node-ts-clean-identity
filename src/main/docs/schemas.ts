import { authenticationRequestSchema, authenticationResponseSchema, createAccountRequestSchema, sessionModelSchema, accountModelSchema } from '@/main/docs/schemas/auth'
import { errorSchema } from '@/main/docs/schemas/utils'

export default {
  authenticationRequest: authenticationRequestSchema,
  authenticationResponse: authenticationResponseSchema,
  error: errorSchema,
  createAccountRequest: createAccountRequestSchema,
  sessionModel: sessionModelSchema,
  accountModel: accountModelSchema
}
