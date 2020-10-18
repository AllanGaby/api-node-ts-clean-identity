import { AccountModel } from '@/domain/models/auth'

export interface GetAccountByEmail {
  getAccountByEmail: (email: string) => Promise<AccountModel>
}
