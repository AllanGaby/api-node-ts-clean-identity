import { ActiveAccountController } from '@/presentation/controllers/auth/account'
import { makeActiveAccountValidation } from '@/main/factories/validations/auth'
import { makeDbActiveAccount } from '@/main/factories/usecases/auth/memory/account'

export const makeActiveAccountController = (): ActiveAccountController => {
  return new ActiveAccountController(
    makeActiveAccountValidation(),
    makeDbActiveAccount())
}
