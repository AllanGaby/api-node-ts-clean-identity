import { ShowAccountBySessionController } from '@/presentation/controllers/auth/account'
import { makeShowAccountUseCase } from '@/main/factories/usecases/auth/account'

export const makeShowAccountBySessionController = (): ShowAccountBySessionController => {
  return new ShowAccountBySessionController(makeShowAccountUseCase())
}
