import { AuthenticationAccount, AuthenticationAccountDTO } from '@/domain/usecases/auth/account'
import { GetAccountByEmailRepository } from '@/data/repositories/auth/account'
import { CreateSessionRepository } from '@/data/repositories/auth/session'
import { HashComparer, Encrypter } from '@/data/protocols/criptography'
import { SessionType, AuthenticationModel } from '@/domain/models/auth'

export class DbAuthenticationAccount implements AuthenticationAccount {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly createSessionRepository: CreateSessionRepository,
    private readonly encrypter: Encrypter
  ) {}

  async authenticate ({ email, password }: AuthenticationAccountDTO): Promise<AuthenticationModel> {
    const account = await this.getAccountByEmailRepository.getAccountByEmail(email)
    if (account) {
      const isCorrectPassword = await this.hashComparer.compare({
        payload: password,
        hashedText: account.password
      })
      if (isCorrectPassword) {
        const session = await this.createSessionRepository.create({
          account_id: account.id,
          type: SessionType.authentication,
          experied_at: new Date(new Date().getDate() + 1)
        })
        const accessToken = await this.encrypter.encrypt(session.id)
        return {
          access_token: accessToken,
          account_type: account.type
        }
      }
    }
    throw new Error('Account not found')
  }
}
