import { DbSendMailSession } from '@/data/usecases/auth/session'
import { makeDbSendMail } from '@/main/factories/usecases/utils'
import { RabbitMQMessageQueueAdapter } from '@/infra/message-queue'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'

export const makeDbSendMailSession = (): DbSendMailSession => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const sessionRepository = authRepositoriesFactory.getSessionRepository()
  const messageQueueAdapter = new RabbitMQMessageQueueAdapter(EnvConfig.urlRabbitMQ)
  return new DbSendMailSession(sessionRepository, 'send-mail', messageQueueAdapter, messageQueueAdapter, makeDbSendMail())
}
