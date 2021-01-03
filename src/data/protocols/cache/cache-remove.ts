export interface CacheRemove {
  remove: (key: string) => Promise<void>
}
