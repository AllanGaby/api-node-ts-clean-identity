import { Hasher } from '@/data/protocols/criptography/hasher'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'
import { UpdateAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { UpdateAccount } from '@/domain/usecases/auth/account'
import { CreateSessionRepository } from '@/data/repositories/auth/session'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hasher: Hasher,
    private readonly updateAccountRepoitory: UpdateAccountRepository,
    private readonly createSessionRepository: CreateSessionRepository
  ) {}

  async update ({ id, name, email, password }: UpdateAccountDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(id)
    if (accountById) {
      let passwordHashed = accountById.password
      if (password) {
        passwordHashed = await this.hasher.createHash(password)
      }
      const emailValided = email ? false : accountById.email_valided
      const updatedAccount = await this.updateAccountRepoitory.update({
        id: accountById.id,
        email,
        password: passwordHashed,
        name,
        email_valided: emailValided
      })
      if (!emailValided) {
        await this.createSessionRepository.add({
          accountId: updatedAccount.id,
          type: SessionType.activeAccount,
          experied_at: new Date(new Date().getDate() + 1)
        })
      }
    }
    return null
  }
}
