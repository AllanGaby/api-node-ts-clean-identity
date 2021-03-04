import { DbSendMailUseCase } from '@/data/usecases/utils'
import { HandlebarsMailTemplateAdapter, NodemailerSendMailAdapter } from '@/infra/comunication'
import { EnvConfig, Environment } from '@/main/config/environment'
import { ExecuteQueue } from '@/data/protocols/message-queue'

export const makeSendMailUseCase = (): ExecuteQueue => {
  const mailTemplateAdapter = new HandlebarsMailTemplateAdapter()
  const sendMailAdapter = new NodemailerSendMailAdapter(EnvConfig.smtpConfig, EnvConfig.environment === Environment.test)
  return new DbSendMailUseCase(mailTemplateAdapter, sendMailAdapter)
}
