export interface CacheRecover {
  recover: <ResultType = any>(key: string) => Promise<ResultType>
}
