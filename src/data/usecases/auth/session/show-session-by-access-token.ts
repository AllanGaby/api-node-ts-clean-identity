import { SessionModel } from '@/domain/models/auth'
import { ShowSessionByAccessToken, ShowSessionByAccessTokenDTO } from '@/domain/usecases/auth/session'
import { Decrypter } from '@/data/protocols/criptography'
import { GetSessionByIdRepository } from '@/data/repositories/auth'
import { InvalidCredentialsError } from '@/data/errors'
import { CacheCreate, CacheRecover } from '@/data/protocols/cache'

export class DbShowSessionByAccessToken implements ShowSessionByAccessToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly cacheRecover: CacheRecover,
    private readonly cacheCreate: CacheCreate
  ) {}

  async show ({ accessToken }: ShowSessionByAccessTokenDTO): Promise<SessionModel> {
    const sessionId = await this.decrypter.decrypt(accessToken)
    await this.cacheRecover.recover(`session-authentication:${sessionId}`)
    if (sessionId) {
      const session = await this.getSessionByIdRepository.getSessionById(sessionId)
      if (session) {
        return session
      }
    }
    throw new InvalidCredentialsError()
  }
}
