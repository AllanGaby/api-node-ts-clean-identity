export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  email_valided: boolean
  avatar_file_id?: string
  created_at: Date
  updated_at: Date
}
