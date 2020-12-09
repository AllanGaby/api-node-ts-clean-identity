import { authenticationRequestSchema, authenticationResponseSchema } from '@/main/docs/schemas/auth'
import { errorSchema } from '@/main/docs/schemas/utils'

export default {
  authenticationRequest: authenticationRequestSchema,
  authenticationResponse: authenticationResponseSchema,
  error: errorSchema
}
