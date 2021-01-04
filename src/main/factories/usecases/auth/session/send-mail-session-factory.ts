import { DbSendMailSession } from '@/data/usecases/auth/session'
import { makeDbSendMail } from '@/main/factories/usecases/utils'
import { RabbitMQMessageQueueAdapter } from '@/infra/message-queue'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'

export const makeDbSendMailSession = (): DbSendMailSession => {
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const messageQueueAdapter = new RabbitMQMessageQueueAdapter(EnvConfig.urlRabbitMQ)
  return new DbSendMailSession(sessionRepository, 'send-mail', messageQueueAdapter, messageQueueAdapter, makeDbSendMail())
}
