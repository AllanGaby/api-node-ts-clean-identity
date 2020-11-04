import { AccessProfileModel } from '@/domain/models/auth'

export interface UpdateAccessProfileModel {
  id: string
  title: string
  list_account: boolean
}

export interface UpdateAccessProfile {
  update: (accessProfileModel: UpdateAccessProfileModel) => Promise<AccessProfileModel>
}
