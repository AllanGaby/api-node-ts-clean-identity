import { AccessProfileModel } from '@/domain/models/auth'

export interface CreateAccessProfile {
  create: (accessProfile: AccessProfileModel) => Promise<AccessProfileModel>
}
