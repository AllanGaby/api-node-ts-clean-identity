import { AccessProfileModel } from '@/domain/models/auth'
import { GetAccessProfileByTitleRepository } from '@/data/repositories/auth/access-profile'
import { MockAccessProfileModel } from './mock-access-profile'

export class GetAccessProfileByTitleRepositorySpy implements GetAccessProfileByTitleRepository {
  title: string
  accessProfile: AccessProfileModel = MockAccessProfileModel()

  async getAccessProfileByTitle (title: string): Promise<AccessProfileModel> {
    this.title = title
    return this.accessProfile
  }
}
