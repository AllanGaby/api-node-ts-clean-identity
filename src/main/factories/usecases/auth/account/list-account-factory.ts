import { DbListAccount } from '@/data/usecases/auth/account'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'

export const makeDbListAccount = (): DbListAccount => {
  return new DbListAccount(MemoryAccountRepository.getInstance())
}
