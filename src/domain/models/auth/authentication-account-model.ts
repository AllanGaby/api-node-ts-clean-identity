import { AccountType } from './account-model'

export interface AuthenticationModel {
  access_token: string
  account_type: AccountType
}
