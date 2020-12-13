import { DbSendMailSession } from '@/data/usecases/auth/session'
import { MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { makeDbSendMail } from '@/main/factories/usecases/utils'
import { RabbitMQMessageQueueAdapter } from '@/infra/message-queue'
import { EnvConfig } from '@/main/config/env'

export const makeDbSendMailSession = (): DbSendMailSession => {
  const sessionRepository = MemorySessionRepository.getInstance()
  const messageQueueAdapter = new RabbitMQMessageQueueAdapter(EnvConfig.urlRabbitMQ)
  return new DbSendMailSession(sessionRepository, 'send-mail', messageQueueAdapter, messageQueueAdapter, makeDbSendMail())
}
