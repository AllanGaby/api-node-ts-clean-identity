import { AccessProfileModel } from '@/domain/models/auth'
import { UpdateAccessProfileModel } from '@/domain/usecases/auth/access-profile'

export interface UpdateAccessProfileRepository {
  update: (updateAccessProfileModel: UpdateAccessProfileModel) => Promise<AccessProfileModel>
}
