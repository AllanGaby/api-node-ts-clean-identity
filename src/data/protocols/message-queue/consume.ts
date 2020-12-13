export interface ConsumeQueue {
  consume: <ParamsType = any, ResultType = any>(queueName: string, callback: (params: ParamsType) => ResultType) => Promise<void>
}
