import { InvalidCredentialsError } from '@/data/errors'
import { DeleteSessionByIdRepository, GetSessionByIdRepository } from '@/data/repositories/auth'
import { CacheRecover } from '@/data/protocols/cache'
import { Logout, LogoutDTO } from '@/domain/usecases/auth/session'
import { SessionModel } from '@/domain/models/auth'

export class DbLogout implements Logout {
  constructor(
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly deleteSessionByIdRepository: DeleteSessionByIdRepository,
    private readonly cacheRecover: CacheRecover
  ) { }

  async logout({ sessionId }: LogoutDTO): Promise<void> {
    let session: SessionModel
    session = await this.cacheRecover.recover(`session-authentication:${sessionId}`)
    if (!session) {
      session = await this.getSessionByIdRepository.getSessionById(sessionId)
    }
    if (session) {
      return await this.deleteSessionByIdRepository.deleteById(session.id)
    }
    throw new InvalidCredentialsError()
  }
}
