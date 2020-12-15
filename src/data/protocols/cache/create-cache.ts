export interface CacheCreate {
  create: (key: string, record: object) => Promise<void>
}
