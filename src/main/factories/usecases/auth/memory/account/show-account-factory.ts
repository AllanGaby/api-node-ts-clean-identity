import { DbShowAccount } from '@/data/usecases/auth/account'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'

export const makeDbShowAccount = (): DbShowAccount => {
  return new DbShowAccount(MemoryAccountRepository.getInstance())
}
