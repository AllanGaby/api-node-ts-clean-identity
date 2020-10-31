import { AccessProfileModel } from '@/domain/models/auth'

export interface ListAccessProfileFilter {
  title: string
}

export interface ListAccessProfile {
  list: (filter: ListAccessProfileFilter) => Promise<AccessProfileModel[]>
}
