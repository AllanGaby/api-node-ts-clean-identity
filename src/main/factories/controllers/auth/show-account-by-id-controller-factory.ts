import { ShowAccountByIdController } from '@/presentation/controllers/auth/account'
import { makeShowAccountByIdValidation } from '@/main/factories/validations/auth'
import { makeDbShowAccount } from '@/main/factories/usecases/auth/memory/account'

export const makeShowAccountByIdController = (): ShowAccountByIdController => {
  return new ShowAccountByIdController(makeShowAccountByIdValidation(), makeDbShowAccount())
}
