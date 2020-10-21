import { SendMailAccountDTO } from '@/domain/dtos/auth/account'
import { SendMailAccount } from '@/domain/usecases/auth/account'
import { SessionModel } from '@/domain/models/auth'
import { mockSessionModel } from './mock-session'

export class SendMailAccountSpy implements SendMailAccount {
  sendMailParams: SendMailAccountDTO
  session: SessionModel = mockSessionModel()

  async sendMail (data: SendMailAccountDTO): Promise<SessionModel> {
    this.sendMailParams = data
    return this.session
  }
}
