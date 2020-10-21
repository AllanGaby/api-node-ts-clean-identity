import { SessionType } from '@/domain/models/auth'

export interface SendMailAccountDTO {
  accountId: string
  sessionType: SessionType
  name: string
  email: string
  subject: string
  mailFilePath: string
}
