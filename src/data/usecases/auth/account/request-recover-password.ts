import { RequestRecoverPasswordDTO } from '@/domain/dtos/auth/account'
import { RequestRecoverPassword, SendMailSession } from '@/domain/usecases/auth/account'
import { GetAccountByEmailRepository } from '@/data/repositories/auth/account'
import { SessionType } from '@/domain/models/auth'

export class DbRequestRecoverPassword implements RequestRecoverPassword {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly sendMailSession: SendMailSession,
    private readonly mailFilePath: string
  ) {}

  async request ({ email }: RequestRecoverPasswordDTO): Promise<boolean> {
    const accountByEmail = await this.getAccountByEmailRepository.getAccountByEmail(email)
    if (accountByEmail) {
      await this.sendMailSession.sendMail({
        accountId: accountByEmail.id,
        email: accountByEmail.email,
        name: accountByEmail.name,
        sessionType: SessionType.recoverPassword,
        subject: `[Identity] - ${accountByEmail.name}, recupere sua senha agora`,
        mailFilePath: this.mailFilePath
      })
      return true
    }
    return false
  }
}
