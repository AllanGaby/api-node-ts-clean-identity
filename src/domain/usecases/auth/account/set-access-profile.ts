import { AccountModel } from '@/domain/models/auth'

export interface SetAccessProfileDTO {
  accountId: string
  accessProfileId: string
}

export interface SetAccessProfile {
  setAccessProfile: (setAccessProfileDTO: SetAccessProfileDTO) => Promise<AccountModel>
}
