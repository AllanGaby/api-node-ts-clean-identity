import { AccountType } from './account'

export interface AuthenticationModel {
  accessToken: string
  accountType: AccountType
}
