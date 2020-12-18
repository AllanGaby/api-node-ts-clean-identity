import { DbUpdateAccount } from '@/data/usecases/auth/account'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { makeDbSendMailSession } from '../session'
import { LocalStorage } from '@/infra/storage'
import { EnvConfig } from '@/main/config/env'

export const makeDbUpdateAccount = (): DbUpdateAccount => {
  const sendMailSession = makeDbSendMailSession()
  const acccountRepository = MemoryAccountRepository.getInstance()
  const sessionRepository = MemorySessionRepository.getInstance()
  const hasherAdapter = new BCrypterHasherAdapter(12)
  const localStorage = new LocalStorage({
    temporaryDir: 'temp',
    uploadDir: 'uploads'
  })
  return new DbUpdateAccount(
    acccountRepository,
    hasherAdapter,
    acccountRepository,
    sendMailSession,
    `${EnvConfig.baseDir}/infra/comunication/views/handlebars/auth/create-account.hbs`,
    localStorage,
    sessionRepository)
}
