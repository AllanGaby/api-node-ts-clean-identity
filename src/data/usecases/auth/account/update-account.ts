import { Hasher } from '@/data/protocols/criptography/hasher'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'
import { UpdateAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { SendMailActiveAccount, UpdateAccount } from '@/domain/usecases/auth/account'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hasher: Hasher,
    private readonly updateAccountRepoitory: UpdateAccountRepository,
    private readonly sendMailActiveAccount: SendMailActiveAccount,
    private readonly mailFilePath: string
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
        await this.sendMailActiveAccount.sendMail({
          accountId: updatedAccount.id,
          email: updatedAccount.email,
          name: updatedAccount.name,
          subject: `[Identity] - ${updatedAccount.name}, sua conta foi alterada com sucesso`,
          mailFilePath: this.mailFilePath
        })
      }
      return updatedAccount
    }
    return null
  }
}
