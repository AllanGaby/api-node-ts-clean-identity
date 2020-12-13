import { DbSendMail } from '@/data/usecases/utils'
import { HandlebarsMailTemplateAdapter, NodemailerSendMailAdapter } from '@/infra/comunication'
import { EnvConfig } from '@/main/config/env'

export const makeDbSendMail = (): DbSendMail => {
  const mailTemplateAdapter = new HandlebarsMailTemplateAdapter()
  const sendMailAdapter = new NodemailerSendMailAdapter(EnvConfig.smtpConfig)
  return new DbSendMail(mailTemplateAdapter, sendMailAdapter)
}
