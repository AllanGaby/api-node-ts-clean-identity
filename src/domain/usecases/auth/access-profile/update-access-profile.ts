import { AccessProfileModel } from '@/domain/models/auth'

export interface UpdateAccessProfileModel {
  id: string
  title: string
  listAccount: boolean
}

export interface UpdateAccessProfile {
  update: (accessProfileModel: UpdateAccessProfileModel) => Promise<AccessProfileModel>
}
