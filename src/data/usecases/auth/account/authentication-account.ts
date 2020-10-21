import { AuthenticationAccountDTO } from '@/domain/dtos/auth/account'
import { AuthenticationAccount } from '@/domain/usecases/auth/account'
import { GetAccountByEmailRepository } from '@/data/repositories/auth/account'

export class DbAuthenticationAccount implements AuthenticationAccount {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository
  ) {}

  async authenticate ({ email, password }: AuthenticationAccountDTO): Promise<string> {
    await this.getAccountByEmailRepository.getAccountByEmail(email)
    return ''
  }
}
