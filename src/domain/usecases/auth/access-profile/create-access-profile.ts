import { AccessProfileModel } from '@/domain/models/auth'

export type CreateAccessProfileDTO = Omit<AccessProfileModel, 'id'>

export interface CreateAccessProfile {
  create: (accessProfile: CreateAccessProfileDTO) => Promise<AccessProfileModel>
}
