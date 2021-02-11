import { SessionModel, SessionType } from '@/domain/models/auth'

export interface SendMailSessionDTO {
  accountId: string
  sessionType: SessionType
  name: string
  email: string
  subject: string
  mailFilePath: string
}

export interface SendMailSessionUseCase {
  sendMail: (data: SendMailSessionDTO) => Promise<SessionModel>
}
