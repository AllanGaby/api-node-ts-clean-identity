import { SendToQueue } from '@/data/protocols/message-queue'

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
