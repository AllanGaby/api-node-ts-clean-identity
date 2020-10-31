import { AccessProfileModel } from '@/domain/models/auth'

export interface GetAccessProfileByIdRepository {
  getAccessProfileById: (id: string) => Promise<AccessProfileModel>
}
