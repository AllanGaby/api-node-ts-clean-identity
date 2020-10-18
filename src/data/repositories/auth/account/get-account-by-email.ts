import { AccountModel } from '@/domain/models/auth'

export interface GetAccountByEmailRepository {
  getAccountByEmail: (email: string) => Promise<AccountModel>
}
