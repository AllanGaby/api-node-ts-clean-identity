import { ExecuteQueue } from './execute-queue'

export interface ConsumeQueue {
  consume: (queueName: string, executor: ExecuteQueue) => Promise<void>
}
