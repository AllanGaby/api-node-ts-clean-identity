import { AuthenticationAccountDTO } from '@/domain/dtos/auth/account'
import { AuthenticationAccount } from '@/domain/usecases/auth/account'
import { GetAccountByEmailRepository } from '@/data/repositories/auth/account'
import { CreateSessionRepository } from '@/data/repositories/auth/session'
import { HashComparer, Encrypter } from '@/data/protocols/criptography'
import { SessionType } from '@/domain/models/auth'

export class DbAuthenticationAccount implements AuthenticationAccount {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly createSessionRepository: CreateSessionRepository,
    private readonly encrypter: Encrypter
  ) {}

  async authenticate ({ email, password }: AuthenticationAccountDTO): Promise<string> {
    const account = await this.getAccountByEmailRepository.getAccountByEmail(email)
    if (account) {
      const isCorrectPassword = await this.hashComparer.compare({
        payload: password,
        hashedText: account.password
      })
      if (isCorrectPassword) {
        await this.createSessionRepository.add({
          accountId: account.id,
          type: SessionType.authentication,
          experied_at: new Date(new Date().getDate() + 1)
        })
        return await this.encrypter.encrypt(account.id)
      }
    }
    return null
  }
}
