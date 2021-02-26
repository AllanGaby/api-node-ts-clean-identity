import { SessionModel } from '@/domain/models/auth'
import { ShowSessionByAccessTokenUseCase, ShowSessionByAccessTokenDTO } from '@/domain/usecases/auth/session'
import { Decrypter } from '@/data/protocols/criptography'
import { GetSessionByIdRepository } from '@/data/repositories/auth'
import { InvalidCredentialsError } from '@/data/errors'
import { CacheCreate, CacheRecover } from '@/data/protocols/cache'

export class DbShowSessionByAccessTokenUseCase implements ShowSessionByAccessTokenUseCase {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly cacheRecover: CacheRecover,
    private readonly cacheCreate: CacheCreate
  ) {}

  async show ({ accessToken }: ShowSessionByAccessTokenDTO): Promise<SessionModel> {
    const sessionId = await this.decrypter.decrypt(accessToken)
    const session = await this.cacheRecover.recover(`session-authentication:${sessionId}`)
    if (session) {
      return session
    }
    if (sessionId) {
      const session = await this.getSessionByIdRepository.getSessionById(sessionId)
      if ((session) && (!session.deleted_at)) {
        await this.cacheCreate.create({
          key: `session-authentication:${session.id}`,
          record: session
        })
        return session
      }
    }
    throw new InvalidCredentialsError()
  }
}
