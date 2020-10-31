import { AccessProfileModel } from '@/domain/models/auth'
import { GetAccessProfileByTitleRepository, CreateAccessProfileRepository } from '@/data/repositories/auth/access-profile'
import { mockAccessProfileModel } from './mock-access-profile'
import { CreateAccessProfileDTO } from '@/domain/usecases/auth/access-profile'

export class GetAccessProfileByTitleRepositorySpy implements GetAccessProfileByTitleRepository {
  title: string
  accessProfile: AccessProfileModel = mockAccessProfileModel()

  async getAccessProfileByTitle (title: string): Promise<AccessProfileModel> {
    this.title = title
    return this.accessProfile
  }
}

export class CreateAccessProfileRepositorySpy implements CreateAccessProfileRepository {
  params: CreateAccessProfileDTO
  accessProfile: AccessProfileModel = mockAccessProfileModel()

  async create (accessProfile: CreateAccessProfileDTO): Promise<AccessProfileModel> {
    this.params = accessProfile
    return this.accessProfile
  }
}
