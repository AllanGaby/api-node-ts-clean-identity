import { SetAccountTypeController } from '@/presentation/controllers/auth/account'
import { makeDbSetAccountType } from '../../usecases/auth/memory/account'
import { makeSetAccountTypeValidation } from '../../validations/auth/set-account-type-factory'

export const makeSetAccountTypeController = (): SetAccountTypeController => {
  return new SetAccountTypeController(makeSetAccountTypeValidation(), makeDbSetAccountType())
}
