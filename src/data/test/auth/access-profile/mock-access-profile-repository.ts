import { AccessProfileModel } from '@/domain/models/auth'
import { GetAccessProfileByTitleRepository, CreateAccessProfileRepository, ListAccessProfileRepository } from '@/data/repositories/auth/access-profile'
import { mockAccessProfileModel } from './mock-access-profile'
import { CreateAccessProfileDTO, ListAccessProfileFilter } from '@/domain/usecases/auth/access-profile'

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

export class ListAccessProfileRepositorySpy implements ListAccessProfileRepository {
  params: ListAccessProfileFilter
  accessProfileList: AccessProfileModel[]

  async listByFilter (filter: ListAccessProfileFilter): Promise<AccessProfileModel[]> {
    this.params = filter
    return this.accessProfileList
  }
}
