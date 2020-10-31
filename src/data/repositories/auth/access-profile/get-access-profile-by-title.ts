import { AccessProfileModel } from '@/domain/models/auth'

export interface GetAccessProfileByTitleRepository {
  getAccessProfileByTitle: (title: string) => Promise<AccessProfileModel>
}
