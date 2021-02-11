import { ShowAccountByIdController } from '@/presentation/controllers/auth/account'
import { makeShowAccountByIdValidation } from '@/main/factories/validations/auth'
import { makeShowAccountUseCase } from '@/main/factories/usecases/auth/account'

export const makeShowAccountByIdController = (): ShowAccountByIdController => {
  return new ShowAccountByIdController(makeShowAccountByIdValidation(), makeShowAccountUseCase())
}
