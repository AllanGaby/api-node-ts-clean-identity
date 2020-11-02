import { UpdateAccessProfile, UpdateAccessProfileModel } from '@/domain/usecases/auth/access-profile'
import { GetAccessProfileByIdRepository, UpdateAccessProfileRepository } from '@/data/repositories/auth/access-profile'
import { AccessProfileModel } from '@/domain/models/auth'

export class DbUpdateAccessProfile implements UpdateAccessProfile {
  constructor (
    private readonly getAccessProfileByIdRepository: GetAccessProfileByIdRepository,
    private readonly updateAccessProfileRepository: UpdateAccessProfileRepository
  ) {}

  async update (updateAccessProfileModel: UpdateAccessProfileModel): Promise<AccessProfileModel> {
    const accessProfile = await this.getAccessProfileByIdRepository.getAccessProfileById(updateAccessProfileModel.id)
    if (accessProfile) {
      return await this.updateAccessProfileRepository.update(updateAccessProfileModel)
    }
    throw new Error('AccessProfile not found')
  }
}
