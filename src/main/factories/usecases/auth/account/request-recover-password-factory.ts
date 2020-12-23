import { DbRequestRecoverPassword } from '@/data/usecases/auth/account'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'
import { makeDbSendMailSession } from '@/main/factories/usecases/auth/session'

export const makeDbRequestRecoverPassword = (): DbRequestRecoverPassword => {
  const accountRepository = MemoryAccountRepository.getInstance()
  return new DbRequestRecoverPassword(
    accountRepository,
    makeDbSendMailSession(),
    'src/infra/comunication/views/handlebars/auth/recover-password.hbs')
}
