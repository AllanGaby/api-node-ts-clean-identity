import { GetAccessProfileByTitleRepository, CreateAccessProfileRepository, GetAccessProfileByIdRepository, ListAccessProfileRepository } from '@/data/repositories/auth/access-profile'
import { CreateAccessProfileDTO, ListAccessProfileFilter } from '@/domain/usecases/auth/access-profile'
import { AccessProfileModel } from '@/domain/models/auth'
import faker from 'faker'

export class MemoryAccessProfileRepository implements GetAccessProfileByTitleRepository, CreateAccessProfileRepository, GetAccessProfileByIdRepository, ListAccessProfileRepository {
  private readonly accessProfiles: AccessProfileModel[]

  constructor () {
    this.accessProfiles = []
  }

  async getAccessProfileByTitle (title: string): Promise<AccessProfileModel> {
    return this.accessProfiles.find(accessProfile => accessProfile.title === title)
  }

  async getAccessProfileById (accessProfileId: string): Promise<AccessProfileModel> {
    return this.accessProfiles.find(accessProfile => accessProfile.id === accessProfileId)
  }

  async create ({ title, listAccount }: CreateAccessProfileDTO): Promise<AccessProfileModel> {
    const accessProfile: AccessProfileModel = {
      id: faker.random.uuid(),
      title,
      listAccount
    }
    this.accessProfiles.push(accessProfile)
    return accessProfile
  }

  async listByFilter ({ title }: ListAccessProfileFilter): Promise<AccessProfileModel[]> {
    return this.accessProfiles.filter(accessProfile => ((!title) || (accessProfile.title === title)))
  }
}
