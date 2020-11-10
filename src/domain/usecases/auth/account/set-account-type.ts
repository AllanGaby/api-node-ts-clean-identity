import { AccountModel, AccountType } from '@/domain/models/auth'

export interface SetAccountTypeDTO {
  accountId: string
  accountType: AccountType
}

export interface SetAccountType {
  setAccountType: (setAccountTypeDTO: SetAccountTypeDTO) => Promise<AccountModel>
}
