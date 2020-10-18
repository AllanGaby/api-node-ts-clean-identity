import { CreateAccount } from '@/domain//usecases/auth/account'
import { AddAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetAccountByEmail } from '@/data/protocols/repository/auth/account'
import { Hasher } from '@/data/protocols/criptography/hasher'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly getAccountByEmail: GetAccountByEmail,
    private readonly hasher: Hasher
  ) {}

  async add (data: AddAccountDTO): Promise<AccountModel> {
    const accountByEmail = await this.getAccountByEmail.getAccountByEmail(data.email)
    if (!accountByEmail) {
      await this.hasher.createHash(data.password)
      return null
    }
  }
}
