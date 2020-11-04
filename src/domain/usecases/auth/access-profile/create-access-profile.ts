import { AccessProfileModel } from '@/domain/models/auth'

export interface CreateAccessProfileDTO {
  title: string
  list_account: boolean
}

export interface CreateAccessProfile {
  create: (accessProfile: CreateAccessProfileDTO) => Promise<AccessProfileModel>
}
