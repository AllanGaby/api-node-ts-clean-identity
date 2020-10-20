import { Hasher } from '@/data/protocols/criptography/hasher'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'
import { UpdateAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { UpdateAccount } from '@/domain/usecases/auth/account'
import { CreateSessionRepository } from '@/data/repositories/auth/session'
import { MailTemplateAdapter, SendMailAdapter } from '@/data/protocols/comunication/mail'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hasher: Hasher,
    private readonly updateAccountRepoitory: UpdateAccountRepository,
    private readonly createSessionRepository: CreateSessionRepository,
    private readonly mailTemplateAdapter: MailTemplateAdapter,
    private readonly mailFilePath: string,
    private readonly sendMailAdapter: SendMailAdapter
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
        const session = await this.createSessionRepository.add({
          accountId: updatedAccount.id,
          type: SessionType.activeAccount,
          experied_at: new Date(new Date().getDate() + 1)
        })
        const variables = {
          sessionId: session.id,
          name
        }
        await this.mailTemplateAdapter.parse({
          filePath: this.mailFilePath,
          variables
        })
      }
    }
    return null
  }
}
