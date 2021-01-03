export interface CacheRemoveByPrefix {
  removeByPrefix: (prefix: string) => Promise<void>
}
