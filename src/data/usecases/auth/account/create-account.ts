import { CreateAccount, SendMailActiveAccount } from '@/domain//usecases/auth/account'
import { CreateAccountDTO } from '@/domain/dtos/auth/account'
import { SessionModel } from '@/domain/models/auth'
import { GetAccountByEmailRepository, CreateAccountRepository } from '@/data/repositories/auth/account'
import { HashCreator } from '@/data/protocols/criptography'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashCreator: HashCreator,
    private readonly createAccountRepository: CreateAccountRepository,
    private readonly sendMailActiveAccount: SendMailActiveAccount,
    private readonly mailFilePath: string
  ) {}

  async add ({ name, email, password }: CreateAccountDTO): Promise<SessionModel> {
    const accountByEmail = await this.getAccountByEmailRepository.getAccountByEmail(email)
    if (!accountByEmail) {
      const passwordHashed = await this.hashCreator.createHash(password)
      const account = await this.createAccountRepository.add({
        name,
        email,
        password: passwordHashed
      })
      const session = await this.sendMailActiveAccount.sendMail({
        accountId: account.id,
        email: account.email,
        name: account.name,
        subject: `[Identity] - ${account.name}, sua conta foi criada com sucesso`,
        mailFilePath: this.mailFilePath
      })
      return session
    }
  }
}
