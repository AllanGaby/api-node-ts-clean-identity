export enum AccountType {
  manager = 1,
  student = 2
}

export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  email_valided: boolean
  type: AccountType
  avatar_extention?: string
  created_at: Date
  updated_at: Date
}
