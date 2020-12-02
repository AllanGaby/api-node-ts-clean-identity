import { DbUpdateAccount } from '@/data/usecases/auth/account'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'
import { makeDbSendMailSession } from '../session'
import { LocalStorage } from '@/infra/storage'

export const makeDbUpdateAccount = (): DbUpdateAccount => {
  const sendMailSession = makeDbSendMailSession()
  const acccountRepository = MemoryAccountRepository.getInstance()
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
    'src/infra/comunication/views/handlebars/auth/create-account.hbs',
    localStorage,
    'uploads')
}
