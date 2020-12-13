export interface SendToQueue {
  sendToQueue: <ParamsType = any>(queueName: string, params: ParamsType) => Promise<boolean>
}
