import { AccessProfileModel } from '@/domain/models/auth'

export interface CreateAccessProfileDTO {
  title: string
  listAccount: boolean
}

export interface CreateAccessProfile {
  create: (accessProfile: CreateAccessProfileDTO) => Promise<AccessProfileModel>
}
