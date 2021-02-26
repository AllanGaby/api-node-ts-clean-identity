export interface CacheCreateDTO {
  key: string
  record: object
}

export interface CacheCreate {
  create: (params: CacheCreateDTO) => Promise<void>
}
