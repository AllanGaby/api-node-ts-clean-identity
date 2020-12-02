import { ShowAccountBySessionController } from '@/presentation/controllers/auth/account'
import { makeDbShowAccount } from '@/main/factories/usecases/auth/memory/account'

export const makeShowAccountBySessionController = (): ShowAccountBySessionController => {
  return new ShowAccountBySessionController(makeDbShowAccount())
}
