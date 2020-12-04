import { LogoutController } from './logout-controller'
import { LogoutSpy, mockLogoutRequest } from '@/presentation/test/auth'
import { forbidden, noContent, serverError } from '@/presentation/helpers'
import { throwError } from '@/data/test'
import { InvalidCredentialsError } from '@/data/errors'

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
    expect(logoutSpy.params.sessionId).toEqual(request.body.session.sessionId)
  })

  test('Should return ServerError if Logout throws', async () => {
    const { sut, logoutSpy } = makeSut()
    jest.spyOn(logoutSpy, 'logout').mockImplementationOnce(throwError)
    const result = await sut.handle(mockLogoutRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Forbidden if Logount return InvalidCredentialError', async () => {
    const { sut, logoutSpy } = makeSut()
    jest.spyOn(logoutSpy, 'logout').mockImplementationOnce(() => { throw new InvalidCredentialsError() })
    const result = await sut.handle(mockLogoutRequest())
    expect(result).toEqual(forbidden(new InvalidCredentialsError()))
  })

  test('Should return NoContent if Logount succeeds', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(mockLogoutRequest())
    expect(result).toEqual(noContent())
  })
})
