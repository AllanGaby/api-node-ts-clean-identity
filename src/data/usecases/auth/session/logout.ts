import { InvalidCredentialsError } from '@/data/errors'
import { GetSessionByIdRepository } from '@/data/repositories/auth'
import { Logout, LogoutDTO } from '@/domain/usecases/auth/session'

export class DbLogout implements Logout {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository
  ) {}

  async logout ({ sessionId }: LogoutDTO): Promise<void> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if (!session) {
      throw new InvalidCredentialsError()
    }
  }
}
