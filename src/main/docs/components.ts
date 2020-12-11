import { badRequest, serverError, unauthorized, forbidden, noContent } from './components/http'
import { apiKeyAuthSchema } from '@/main/docs/schemas/auth/session'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  serverError,
  unauthorized,
  forbidden,
  noContent
}
