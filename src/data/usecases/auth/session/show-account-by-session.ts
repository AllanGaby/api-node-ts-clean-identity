import { AccountModel } from '@/domain/models/auth'
import { ShowAccountBySession, ShowAccountBySessionDTO } from '@/domain/usecases/auth/session'
import { Decrypter } from '@/data/protocols/criptography'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account'
import { GetSessionByIdRepository } from '@/data/repositories/auth/session'

export class DbShowAccountBySession implements ShowAccountBySession {
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
        await this.getAccountByIdRepository.getAccountById(session.accountId)
      }
    }
    return null
  }
}
