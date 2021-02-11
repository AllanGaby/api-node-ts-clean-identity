import { LogoutController } from '@/presentation/controllers/auth/session'
import { makeLogoutUseCase } from '@/main/factories/usecases/auth/session'

export const makeLogoutController = (): LogoutController => {
  return new LogoutController(makeLogoutUseCase())
}
