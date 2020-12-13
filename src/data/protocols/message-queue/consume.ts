export interface ConsumeQueue {
  sendToQueue: <ParamsType = any, ResultType = any>(queueName: string, callback: (params: ParamsType) => ResultType) => Promise<boolean>
}
