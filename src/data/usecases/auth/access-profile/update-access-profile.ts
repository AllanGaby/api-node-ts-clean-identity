import { UpdateAccessProfile, UpdateAccessProfileModel } from '@/domain/usecases/auth/access-profile'
import { GetAccessProfileByIdRepository } from '@/data/repositories/auth/access-profile'
import { AccessProfileModel } from '@/domain/models/auth'

export class DbUpdateAccessProfile implements UpdateAccessProfile {
  constructor (
    private readonly getAccessProfileByIdRepository: GetAccessProfileByIdRepository
  ) {}

  async update (updateAccessProfileModel: UpdateAccessProfileModel): Promise<AccessProfileModel> {
    await this.getAccessProfileByIdRepository.getAccessProfileById(updateAccessProfileModel.id)
    return null
  }
}
