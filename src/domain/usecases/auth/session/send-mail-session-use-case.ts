import { SessionModel, SessionType } from '@/domain/models/auth'

export interface SendMailSessionDTO {
  accountId: string
  sessionType: SessionType
  name: string
  email: string
  subject: string
  mailFilePath: string
}

export interface SendMailSession {
  sendMail: (data: SendMailSessionDTO) => Promise<SessionModel>
}
