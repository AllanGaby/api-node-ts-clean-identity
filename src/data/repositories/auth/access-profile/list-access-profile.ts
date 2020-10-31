import { AccessProfileModel } from '@/domain/models/auth'
import { ListAccessProfileFilter } from '@/domain/usecases/auth/access-profile'

export interface ListAccessProfileRepository {
  listByFilter: (filter: ListAccessProfileFilter) => Promise<AccessProfileModel[]>
}
