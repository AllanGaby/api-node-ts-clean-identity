export interface ConsumeQueue {
  consume: (queueName: string, callback: (params: any) => any) => Promise<void>
}
