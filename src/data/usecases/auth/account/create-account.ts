import { CreateAccount, CreateAccountDTO } from '@/domain/usecases/auth/account'
import { SendMailSession } from '@/domain/usecases/auth/session'
import { SessionModel, SessionType } from '@/domain/models/auth'
import { GetAccountByEmailRepository, CreateAccountRepository } from '@/data/repositories/auth/account'
import { HashCreator } from '@/data/protocols/criptography'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashCreator: HashCreator,
    private readonly createAccountRepository: CreateAccountRepository,
    private readonly sendMailSession: SendMailSession,
    private readonly mailFilePath: string
  ) {}

  async create ({ name, email, password }: CreateAccountDTO): Promise<SessionModel> {
    const accountByEmail = await this.getAccountByEmailRepository.getAccountByEmail(email)
    if (accountByEmail) {
      throw new Error('The received email is already in use')
    } else {
      const passwordHashed = await this.hashCreator.createHash(password)
      const account = await this.createAccountRepository.create({
        name,
        email,
        password: passwordHashed
      })
      const session = await this.sendMailSession.sendMail({
        accountId: account.id,
        email: account.email,
        name: account.name,
        subject: `[Identity] - ${account.name}, sua conta foi criada com sucesso`,
        mailFilePath: this.mailFilePath,
        sessionType: SessionType.activeAccount
      })
      return session
    }
  }
}
