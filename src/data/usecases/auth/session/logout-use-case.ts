import { InvalidCredentialsError } from '@/data/errors'
import { DeleteSessionByIdRepository, GetSessionByIdRepository } from '@/data/repositories/auth'
import { CacheRecover, CacheRemove } from '@/data/protocols/cache'
import { LogoutUseCase, LogoutDTO } from '@/domain/usecases/auth/session'
import { SessionModel } from '@/domain/models/auth'

export class DbLogoutUseCase implements LogoutUseCase {
  constructor(
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly deleteSessionByIdRepository: DeleteSessionByIdRepository,
    private readonly cacheRecover: CacheRecover,
    private readonly cacheRemove: CacheRemove
  ) { }

  async logout({ sessionId }: LogoutDTO): Promise<void> {
    let session: SessionModel
    const cacheKey = `session-authentication:${sessionId}`
    session = await this.cacheRecover.recover(cacheKey)
    if (!session) {
      session = await this.getSessionByIdRepository.getSessionById(sessionId)
    }
    if (session) {
      await this.cacheRemove.remove(cacheKey)
      return await this.deleteSessionByIdRepository.deleteById(session.id)
    }
    throw new InvalidCredentialsError()
  }
}
