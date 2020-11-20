import { DbSendMailSession } from '@/data/usecases/auth/session'
import { MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { HandlebarsMailTemplateAdapter, NodemailerSendMailAdapter } from '@/infra/comunication'

export const makeDbSendMailSession = (): DbSendMailSession => {
  const sessionRepository = new MemorySessionRepository()
  const mailTemplateAdapter = new HandlebarsMailTemplateAdapter()
  const sendMailAdapter = new NodemailerSendMailAdapter()
  return new DbSendMailSession(sessionRepository, mailTemplateAdapter, sendMailAdapter)
}
