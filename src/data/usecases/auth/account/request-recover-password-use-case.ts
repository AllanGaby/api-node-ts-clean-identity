import { RequestRecoverPasswordUseCase, RequestRecoverPasswordDTO } from '@/domain/usecases/auth/account'
import { SendMailSessionUseCase } from '@/domain/usecases/auth/session'
import { GetAccountByEmailRepository } from '@/data/repositories/auth/account'
import { SessionModel, SessionType } from '@/domain/models/auth'
import { AccountNotFoundError } from '@/data/errors'

export class DbRequestRecoverPasswordUseCase implements RequestRecoverPasswordUseCase {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly sendMailSession: SendMailSessionUseCase,
    private readonly mailFilePath: string
  ) {}

  async request ({ email }: RequestRecoverPasswordDTO): Promise<SessionModel> {
    const accountByEmail = await this.getAccountByEmailRepository.getAccountByEmail(email)
    if (accountByEmail) {
      return await this.sendMailSession.sendMail({
        accountId: accountByEmail.id,
        email: accountByEmail.email,
        name: accountByEmail.name,
        sessionType: SessionType.recoverPassword,
        subject: `[Identity] - ${accountByEmail.name}, recupere sua senha agora`,
        mailFilePath: this.mailFilePath
      })
    }
    throw new AccountNotFoundError()
  }
}
