import { AccountModel } from '@/domain/models/auth'

export interface DeleteAvatarAccountDTO {
  accountId: string
}

export interface DeleteAvatarAccountUseCase {
  delete: (account: DeleteAvatarAccountDTO) => Promise<AccountModel>
}
