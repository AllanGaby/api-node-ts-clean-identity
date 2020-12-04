import { SetAccountTypeController } from '@/presentation/controllers/auth/account'
import { makeDbSetAccountType } from '@/main/factories/usecases/auth/memory/account'
import { makeSetAccountTypeValidation } from '@/main/factories/validations/auth/set-account-type-factory'

export const makeSetAccountTypeController = (): SetAccountTypeController => {
  return new SetAccountTypeController(makeSetAccountTypeValidation(), makeDbSetAccountType())
}
