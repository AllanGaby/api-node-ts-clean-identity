import { AccountType } from './account'

export interface AuthenticationModel {
  access_token: string
  account_type: AccountType
}
