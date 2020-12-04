import { LogoutController } from './logout-controller'
import { LogoutSpy, mockLogoutRequest } from '@/presentation/test/auth'

interface sutTypes {
  sut: LogoutController
  logoutSpy: LogoutSpy
}

const makeSut = (): sutTypes => {
  const logoutSpy = new LogoutSpy()
  const sut = new LogoutController(logoutSpy)
  return {
    sut,
    logoutSpy
  }
}

describe('LogoutController', () => {
  test('Should call Logout with correct values', async () => {
    const { sut, logoutSpy } = makeSut()
    const request = mockLogoutRequest()
    await sut.handle(request)
    expect(logoutSpy.params.sessionId).toEqual(request.body.sessionId)
  })
})
