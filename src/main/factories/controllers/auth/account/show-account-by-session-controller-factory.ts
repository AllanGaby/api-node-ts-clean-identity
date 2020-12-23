import { ShowAccountBySessionController } from '@/presentation/controllers/auth/account'
import { makeDbShowAccount } from '@/main/factories/usecases/auth/account'

export const makeShowAccountBySessionController = (): ShowAccountBySessionController => {
  return new ShowAccountBySessionController(makeDbShowAccount())
}
