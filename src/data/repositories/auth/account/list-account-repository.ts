import { AccountModel } from '@/domain/models/auth'
import { ListAccountDTO } from '@/domain/usecases/auth/account'

export type ListAccountRepositoryDTO = ListAccountDTO

export interface ListAccountRepository {
  list: (filter: ListAccountRepositoryDTO) => Promise<AccountModel[]>
}
