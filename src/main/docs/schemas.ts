import { authenticationRequestSchema, authenticationResponseSchema, createAccountRequestSchema, sessionModelSchema } from '@/main/docs/schemas/auth'
import { errorSchema } from '@/main/docs/schemas/utils'

export default {
  authenticationRequest: authenticationRequestSchema,
  authenticationResponse: authenticationResponseSchema,
  error: errorSchema,
  createAccountRequest: createAccountRequestSchema,
  sessionModel: sessionModelSchema
}
