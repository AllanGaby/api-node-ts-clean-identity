export enum AccountType {
  student
}

export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  email_valided: boolean
  type: AccountType
  created_at: Date
  updated_at: Date
}
