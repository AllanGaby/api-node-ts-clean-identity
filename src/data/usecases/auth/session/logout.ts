import { InvalidCredentialsError } from '@/data/errors'
import { DeleteSessionRepository, GetSessionByIdRepository } from '@/data/repositories/auth'
import { Logout, LogoutDTO } from '@/domain/usecases/auth/session'

export class DbLogout implements Logout {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly deleteSessionRepository: DeleteSessionRepository
  ) {}

  async logout ({ sessionId }: LogoutDTO): Promise<void> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if (!session) {
      throw new InvalidCredentialsError()
    } else {
      this.deleteSessionRepository.delete(session)
    }
  }
}
