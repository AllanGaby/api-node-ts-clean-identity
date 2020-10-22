import { SendMailSessionDTO } from '@/domain/dtos/auth/account'
import { SendMailSession } from '@/domain/usecases/auth/account'
import { SessionModel } from '@/domain/models/auth'
import { mockSessionModel } from './mock-session'

export class SendMailSessionSpy implements SendMailSession {
  sendMailParams: SendMailSessionDTO
  session: SessionModel = mockSessionModel()

  async sendMail (data: SendMailSessionDTO): Promise<SessionModel> {
    this.sendMailParams = data
    return this.session
  }
}
