import { RecoverPassword } from '@/domain/usecases/auth/account'
import { RecoverPasswordDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetSessionByIdRepository } from '@/data/repositories/auth/session'

export class DbRecoverPassword implements RecoverPassword {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository
  ) {}

  async recover ({ password, sessionId }: RecoverPasswordDTO): Promise<AccountModel> {
    await this.getSessionByIdRepository.getSessionById(sessionId)
    return null
  }
}
