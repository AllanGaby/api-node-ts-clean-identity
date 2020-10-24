import { AccountModel } from '@/domain/models/auth'
import { ShowAccountBySession, ShowAccountBySessionDTO } from '@/domain/usecases/auth/session'
import { Decrypter } from '@/data/protocols/criptography'
import { GetSessionByIdRepository } from '@/data/repositories/auth/session'

export class DbShowAccountBySession implements ShowAccountBySession {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly getSessionByIdRepository: GetSessionByIdRepository
  ) {}

  async show ({ accessToken }: ShowAccountBySessionDTO): Promise<AccountModel> {
    const sessionId = await this.decrypter.decrypt(accessToken)
    if (sessionId) {
      await this.getSessionByIdRepository.getSessionById(sessionId)
    }
    return null
  }
}
