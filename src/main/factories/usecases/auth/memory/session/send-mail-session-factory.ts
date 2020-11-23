import { DbSendMailSession } from '@/data/usecases/auth/session'
import { MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { HandlebarsMailTemplateAdapter, NodemailerSendMailAdapter } from '@/infra/comunication'
import { EnvConfig } from '@/main/config/env'

export const makeDbSendMailSession = (): DbSendMailSession => {
  const sessionRepository = MemorySessionRepository.getInstance()
  const mailTemplateAdapter = new HandlebarsMailTemplateAdapter()
  const sendMailAdapter = new NodemailerSendMailAdapter(EnvConfig.smtpConfig)
  return new DbSendMailSession(sessionRepository, mailTemplateAdapter, sendMailAdapter)
}
