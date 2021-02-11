import { SendMailSessionUseCase } from '@/domain/usecases/auth/session'
import { DbSendMailSessionUseCase } from '@/data/usecases/auth/session'
import { makeSendMailUseCase } from '@/main/factories/usecases/utils'
import { RabbitMQMessageQueueAdapter } from '@/infra/message-queue'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'

export const makeSendMailSessionUseCase = (): SendMailSessionUseCase => {
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const messageQueueAdapter = new RabbitMQMessageQueueAdapter(EnvConfig.urlRabbitMQ)
  return new DbSendMailSessionUseCase(sessionRepository, 'send-mail', messageQueueAdapter, messageQueueAdapter, makeSendMailUseCase())
}
