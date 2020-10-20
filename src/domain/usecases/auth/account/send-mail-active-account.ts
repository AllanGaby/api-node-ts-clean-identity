import { SendMailActiveAccountDTO } from '@/domain/dtos/auth/account'
import { SessionModel } from '@/domain/models/auth'

export interface SendMailActiveAccount {
  sendMail: (data: SendMailActiveAccountDTO) => Promise<SessionModel>
}
