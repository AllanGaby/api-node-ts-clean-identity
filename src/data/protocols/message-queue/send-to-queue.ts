export interface SendToQueueDTO<ParamsType> {
  queueName: string
  params: ParamsType
}

export interface SendToQueue {
  sendToQueue: <ParamsType = any>(params: SendToQueueDTO<ParamsType>) => Promise<boolean>
}
