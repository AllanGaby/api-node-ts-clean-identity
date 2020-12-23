import { ActiveAccountController } from '@/presentation/controllers/auth/account'
import { makeActiveAccountValidation } from '@/main/factories/validations/auth'
import { makeDbActiveAccount } from '@/main/factories/usecases/auth/account'

export const makeActiveAccountController = (): ActiveAccountController => {
  return new ActiveAccountController(
    makeActiveAccountValidation(),
    makeDbActiveAccount())
}
