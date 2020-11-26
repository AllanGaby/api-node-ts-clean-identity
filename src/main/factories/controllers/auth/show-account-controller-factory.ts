import { ShowAccountController } from '@/presentation/controllers/auth/account'
import { makeDbShowAccount } from '@/main/factories/usecases/auth/memory/account'
import { makeShowAccountValidation } from '@/main/factories/validations/auth'

export const makeShowAccountController = (): ShowAccountController => {
  return new ShowAccountController(makeShowAccountValidation(), makeDbShowAccount())
}
