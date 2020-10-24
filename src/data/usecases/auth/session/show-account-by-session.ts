import { AccountModel } from '@/domain/models/auth'
import { ShowAccountBySession, ShowAccountBySessionDTO } from '@/domain/usecases/auth/session'
import { Decrypter } from '@/data/protocols/criptography'

export class DbShowAccountBySession implements ShowAccountBySession {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async show ({ accessToken }: ShowAccountBySessionDTO): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
