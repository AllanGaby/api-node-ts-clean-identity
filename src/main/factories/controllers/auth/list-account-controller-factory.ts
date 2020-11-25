import { ListAccountController } from '@/presentation/controllers/auth/account'
import { makeDbListAccount } from '@/main/factories/usecases/auth/memory/account'

export const makeListAccountController = (): ListAccountController => {
  return new ListAccountController(makeDbListAccount())
}
