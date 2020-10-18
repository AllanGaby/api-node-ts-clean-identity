import { CreateAccount } from '@/domain//usecases/auth/account'
import { AddAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetAccountByEmail } from '@/data/protocols/repository/auth/account'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly getAccountByEmail: GetAccountByEmail
  ) {}

  async add (data: AddAccountDTO): Promise<AccountModel> {
    await this.getAccountByEmail.getAccountByEmail(data.email)
    return null
  }
}
