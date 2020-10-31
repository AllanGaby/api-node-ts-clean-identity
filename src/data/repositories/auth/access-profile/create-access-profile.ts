import { AccessProfileModel } from '@/domain/models/auth'
import { CreateAccessProfileDTO } from '@/domain/usecases/auth/access-profile'

export interface CreateAccessProfileRepository {
  create: (accessProfileDTO: CreateAccessProfileDTO) => Promise<AccessProfileModel>
}
