import { SendToQueue, ConsumeQueue, ExecuteQueue } from '@/data/protocols/message-queue'

export class SendToQueueSpy implements SendToQueue {
  params: any
  queueName: string
  result: boolean = true

  async sendToQueue<ParamsType = any>(queueName: string, params: ParamsType): Promise<boolean> {
    this.queueName = queueName
    this.params = params
    return this.result
  }
}

export class ExecuteQueueSpy implements ExecuteQueue {
  params: any

  async execute (params: any): Promise<void> {
    this.params = params
  }
}

export class ConsumeQueueSpy implements ConsumeQueue {
  queueName: string
  executor: ExecuteQueue

  async consume (queueName: string, executor: ExecuteQueue): Promise<void> {
    this.queueName = queueName
    this.executor = executor
  }
}
