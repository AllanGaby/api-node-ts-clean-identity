import { DbCreateAccount } from '@/data/usecases/auth/account'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { makeDbSendMailSession } from '@/main/factories/usecases/auth/memory/session'

export const makeDbCreateAccount = (): DbCreateAccount => {
  const sendMailSession = makeDbSendMailSession()
  const acccountRepository = new MemoryAccountRepository()
  const hasherAdapter = new BCrypterHasherAdapter(12)
  return new DbCreateAccount(
    acccountRepository,
    hasherAdapter,
    acccountRepository,
    sendMailSession,
    '@/infra/comunication/views/handlebars/auth/create-account.hbs')
}
