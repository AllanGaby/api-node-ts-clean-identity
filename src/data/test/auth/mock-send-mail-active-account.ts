import { SendMailActiveAccountDTO } from '@/domain/dtos/auth/account'
import { SendMailActiveAccount } from '@/domain/usecases/auth/account'
import { SessionModel } from '@/domain/models/auth'
import { mockSessionModel } from './mock-session'

export class SendMailActiveAccountSpy implements SendMailActiveAccount {
  sendMailParams: SendMailActiveAccountDTO
  session: SessionModel = mockSessionModel()

  async sendMail (data: SendMailActiveAccountDTO): Promise<SessionModel> {
    this.sendMailParams = data
    return this.session
  }
}
