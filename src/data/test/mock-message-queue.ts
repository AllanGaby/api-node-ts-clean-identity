import { SendToQueue, ConsumeQueue } from '@/data/protocols/message-queue'

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

export class ConsumeQueueSpy implements ConsumeQueue {
  queueName: string
  callback: (params: any) => any

  async consume<ParamsType = any, ResultType = any>(queueName: string, callback: (params: ParamsType) => ResultType): Promise<void> {
    this.queueName = queueName
    this.callback = callback
  }
}
