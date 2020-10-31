import { SendMailSession, SendMailSessionDTO } from '@/domain/usecases/auth/session'
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
