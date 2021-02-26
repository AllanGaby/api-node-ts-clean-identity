import { SendToQueue, ConsumeQueue, ExecuteQueue, SendToQueueDTO, ConsumeQueueDTO } from '@/data/protocols/message-queue'

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

export class ConsumeQueueStub implements ConsumeQueue {
  params: ConsumeQueueDTO

  async consume (params: ConsumeQueueDTO): Promise<void> {
    this.params = params
  }
}
