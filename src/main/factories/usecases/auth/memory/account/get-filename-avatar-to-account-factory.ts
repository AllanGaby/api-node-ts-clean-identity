import { DbGetFilenameToAccountAvatar } from '@/data/usecases/auth/account'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'

export const makeDbGetFilenameToAccountAvatar = (): DbGetFilenameToAccountAvatar => {
  const accountRepository = MemoryAccountRepository.getInstance()
  return new DbGetFilenameToAccountAvatar(accountRepository)
}
