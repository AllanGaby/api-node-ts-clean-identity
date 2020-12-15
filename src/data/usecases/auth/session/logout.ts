import { InvalidCredentialsError } from '@/data/errors'
import { DeleteSessionByIdRepository, GetSessionByIdRepository } from '@/data/repositories/auth'
import { Logout, LogoutDTO } from '@/domain/usecases/auth/session'

export class DbLogout implements Logout {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly deleteSessionByIdRepository: DeleteSessionByIdRepository
  ) {}

  async logout ({ sessionId }: LogoutDTO): Promise<void> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if (session) {
      return await this.deleteSessionByIdRepository.deleteById(session.id)
    }
    throw new InvalidCredentialsError()
  }
}
