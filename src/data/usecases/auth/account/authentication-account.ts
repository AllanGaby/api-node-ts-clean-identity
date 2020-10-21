import { AuthenticationAccountDTO } from '@/domain/dtos/auth/account'
import { AuthenticationAccount } from '@/domain/usecases/auth/account'
import { GetAccountByEmailRepository } from '@/data/repositories/auth/account'
import { HashComparer } from '@/data/protocols/criptography'

export class DbAuthenticationAccount implements AuthenticationAccount {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async authenticate ({ email, password }: AuthenticationAccountDTO): Promise<string> {
    const account = await this.getAccountByEmailRepository.getAccountByEmail(email)
    if (account) {
      await this.hashComparer.compare({
        payload: password,
        hashedText: account.password
      })
    }
    return null
  }
}
