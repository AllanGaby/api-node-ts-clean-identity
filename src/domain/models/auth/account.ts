export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  email_valided: boolean
  accessProfileId?: string
  created_at: Date
  updated_at: Date
}
