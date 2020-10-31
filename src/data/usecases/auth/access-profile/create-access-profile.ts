import { AccessProfileModel } from '@/domain/models/auth'
import { CreateAccessProfile, CreateAccessProfileDTO } from '@/domain/usecases/auth/access-profile'
import { GetAccessProfileByTitleRepository, CreateAccessProfileRepository } from '@/data/repositories/auth/access-profile'

export class DbCreateAccessProfile implements CreateAccessProfile {
  constructor (
    private readonly getAccessProfileByTitleRepository: GetAccessProfileByTitleRepository,
    private readonly createAccessProfileRepository: CreateAccessProfileRepository
  ) {}

  async create (accessProfileDTO: CreateAccessProfileDTO): Promise<AccessProfileModel> {
    const accessProfileByTitle = await this.getAccessProfileByTitleRepository.getAccessProfileByTitle(accessProfileDTO.title)
    if (!accessProfileByTitle) {
      return await this.createAccessProfileRepository.create(accessProfileDTO)
    }
    return null
  }
}
