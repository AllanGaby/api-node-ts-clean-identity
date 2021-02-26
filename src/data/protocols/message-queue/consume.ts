import { ExecuteQueue } from './execute-queue'

export interface ConsumeQueueDTO {
  queueName: string
  executor: ExecuteQueue
}

export interface ConsumeQueue {
  consume: (params: ConsumeQueueDTO) => Promise<void>
}
