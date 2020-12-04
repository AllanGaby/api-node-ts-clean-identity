import { DbShowSessionByAccessToken } from '@/data/usecases/auth/session'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { EnvConfig } from '@/main/config/env'

export const makeDbShowSessionByAccessToken = (): DbShowSessionByAccessToken => {
  const encrypterAdapter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  const sessionRepository = MemorySessionRepository.getInstance()
  return new DbShowSessionByAccessToken(encrypterAdapter, sessionRepository)
}
