import { AccessProfileModel } from '@/domain/models/auth'
import { ListAccessProfile, ListAccessProfileFilter } from '@/domain/usecases/auth/access-profile'
import { ListAccessProfileRepository } from '@/data/repositories/auth/access-profile'

export class DbListAccessProfile implements ListAccessProfile {
  constructor (private readonly listAccessProfileRepository: ListAccessProfileRepository) {}

  async list (filter: ListAccessProfileFilter): Promise<AccessProfileModel[]> {
    return await this.listAccessProfileRepository.listByFilter(filter)
  }
}
