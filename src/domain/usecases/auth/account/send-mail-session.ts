import { SendMailSessionDTO } from '@/domain/dtos/auth/account'
import { SessionModel } from '@/domain/models/auth'

export interface SendMailSession {
  sendMail: (data: SendMailSessionDTO) => Promise<SessionModel>
}
