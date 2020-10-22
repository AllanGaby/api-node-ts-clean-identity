import { SendMailSessionDTO } from '@/domain/dtos/auth/session'
import { SessionModel } from '@/domain/models/auth'

export interface SendMailSession {
  sendMail: (data: SendMailSessionDTO) => Promise<SessionModel>
}
