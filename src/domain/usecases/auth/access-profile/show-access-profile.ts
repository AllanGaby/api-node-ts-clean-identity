import { AccessProfileModel } from '@/domain/models/auth'

export interface ShowAccessProfile {
  show: (accessProfileId: string) => Promise<AccessProfileModel>
}
