import { CreateAccount } from '@/domain//usecases/auth/account'
import { AddAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetAccountByEmailRepository, CreateAccountRepository } from '@/data/repositories/auth/account'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { CreateSessionRepository } from '@/data/repositories/auth/session'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository,
    private readonly createSessionRepository: CreateSessionRepository
  ) {}

  async add (data: AddAccountDTO): Promise<AccountModel> {
    const accountByEmail = await this.getAccountByEmailRepository.getAccountByEmail(data.email)
    if (!accountByEmail) {
      const { name, email, password } = data
      const passwordHashed = await this.hasher.createHash(password)
      const account = await this.createAccountRepository.add({
        name,
        email,
        password: passwordHashed
      })
      return account
    }
  }
}
