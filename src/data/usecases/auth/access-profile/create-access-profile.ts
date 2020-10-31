import { AccessProfileModel } from '@/domain/models/auth'
import { CreateAccessProfile, CreateAccessProfileDTO } from '@/domain/usecases/auth/access-profile'
import { GetAccessProfileByTitleRepository } from '@/data/repositories/auth/access-profile'

export class DbCreateAccessProfile implements CreateAccessProfile {
  constructor (
    private readonly getAccessProfileByTitleRepository: GetAccessProfileByTitleRepository
  ) {}

  async create (accessProfile: CreateAccessProfileDTO): Promise<AccessProfileModel> {
    await this.getAccessProfileByTitleRepository.getAccessProfileByTitle(accessProfile.title)
    return null
  }
}
