import { AccessProfileModel } from '@/domain/models/auth'
import { ShowAccessProfile } from '@/domain/usecases/auth/access-profile'
import { GetAccessProfileByIdRepository } from '@/data/repositories/auth/access-profile'

export class DbShowAccessProfile implements ShowAccessProfile {
  constructor (private readonly getAccessProfileByIdRepository: GetAccessProfileByIdRepository) {}

  async show (accessProfileId: string): Promise<AccessProfileModel> {
    return await this.getAccessProfileByIdRepository.getAccessProfileById(accessProfileId)
  }
}
