import { DbSetAccountType } from '@/data/usecases/auth/account'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'

export const makeDbSetAccountType = (): DbSetAccountType => {
  const accountRepository = MemoryAccountRepository.getInstance()
  return new DbSetAccountType(accountRepository, accountRepository)
}
