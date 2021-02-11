import { AccountModel } from '@/domain/models/auth'
import { ShowAccountBySessionUseCase, ShowAccountBySessionDTO } from '@/domain/usecases/auth/session'
import { Decrypter } from '@/data/protocols/criptography'
import { GetAccountByIdRepository, GetSessionByIdRepository } from '@/data/repositories/auth'
import { InvalidCredentialsError } from '@/data/errors'

export class DbShowAccountBySessionUseCase implements ShowAccountBySessionUseCase {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly getAccountByIdRepository: GetAccountByIdRepository
  ) {}

  async show ({ accessToken }: ShowAccountBySessionDTO): Promise<AccountModel> {
    const sessionId = await this.decrypter.decrypt(accessToken)
    if (sessionId) {
      const session = await this.getSessionByIdRepository.getSessionById(sessionId)
      if (session) {
        return await this.getAccountByIdRepository.getAccountById(session.account_id)
      }
    }
    throw new InvalidCredentialsError()
  }
}
