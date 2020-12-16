import { DbShowSessionByAccessToken } from '@/data/usecases/auth/session'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { EnvConfig } from '@/main/config/env'
import { MemoryCacheAdapter } from '@/infra/cache'

export const makeDbShowSessionByAccessToken = (): DbShowSessionByAccessToken => {
  const encrypterAdapter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  const sessionRepository = MemorySessionRepository.getInstance()
  const cacheAdapter = new MemoryCacheAdapter()
  return new DbShowSessionByAccessToken(encrypterAdapter, sessionRepository, cacheAdapter, cacheAdapter)
}
