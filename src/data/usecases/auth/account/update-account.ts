import { Hasher } from '@/data/protocols/criptography/hasher'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'
import { UpdateAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { UpdateAccount } from '@/domain/usecases/auth/account'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hasher: Hasher,
    private readonly updateAccountRepoitory: UpdateAccountRepository
  ) {}

  async update ({ id, name, email, password }: UpdateAccountDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(id)
    if (accountById) {
      let passwordHashed = accountById.password
      if (password) {
        passwordHashed = await this.hasher.createHash(password)
      }
      const emailValided = email ? true : accountById.email_valided
      await this.updateAccountRepoitory.update({
        id: accountById.id,
        email,
        password: passwordHashed,
        name,
        email_valided: emailValided
      })
    }
    return null
  }
}
