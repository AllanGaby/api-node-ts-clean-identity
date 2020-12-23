import { ListAccountController } from '@/presentation/controllers/auth/account'
import { makeDbListAccount } from '@/main/factories/usecases/auth/account'

export const makeListAccountController = (): ListAccountController => {
  return new ListAccountController(makeDbListAccount())
}
