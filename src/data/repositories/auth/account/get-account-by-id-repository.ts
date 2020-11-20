import { AccountModel } from '@/domain/models/auth'

export interface GetAccountByIdRepository {
  getAccountById: (id: string) => Promise<AccountModel>
}
