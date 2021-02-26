import { SendToQueue, ConsumeQueue, ExecuteQueue, SendToQueueDTO } from '@/data/protocols/message-queue'

export class SendToQueueSpy implements SendToQueue {
  params: SendToQueueDTO<any>
  result: boolean = true

  async sendToQueue<ParamsType = any>(params: SendToQueueDTO<ParamsType>): Promise<boolean> {
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
