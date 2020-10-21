import { SendMailAccountDTO } from '@/domain/dtos/auth/account'
import { SessionModel } from '@/domain/models/auth'

export interface SendMailAccount {
  sendMail: (data: SendMailAccountDTO) => Promise<SessionModel>
}
