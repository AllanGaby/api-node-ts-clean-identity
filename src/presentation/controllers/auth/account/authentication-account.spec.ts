import { AuthenticationAccountController } from './authentication-account'
import { ValidationCompositeSpy } from '@/validation/test'
import { AuthenticationAccountSpy, mockAuthenticationAccountRequest } from '@/presentation/test/auth'
import { badRequest, serverError } from '@/presentation/helpers'
import { throwError } from '@/data/test'

interface sutTypes {
  sut: AuthenticationAccountController
  validationCompositeSpy: ValidationCompositeSpy
  authenticationAccountSpy: AuthenticationAccountSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const authenticationAccountSpy = new AuthenticationAccountSpy()
  const sut = new AuthenticationAccountController(validationCompositeSpy, authenticationAccountSpy)
  return {
    sut,
    validationCompositeSpy,
    authenticationAccountSpy
  }
}

describe('AuthenticationAccountController', () => {
  test('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockAuthenticationAccountRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.body)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockAuthenticationAccountRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call AuthenticationAccount with correct values', async () => {
    const { sut, authenticationAccountSpy } = makeSut()
    const request = mockAuthenticationAccountRequest()
    await sut.handle(request)
    expect(authenticationAccountSpy.params).toEqual({
      email: request.body.email,
      password: request.body.password
    })
  })

  test('Should return ServerError if CreateAccount usecase throws', async () => {
    const { sut, authenticationAccountSpy } = makeSut()
    jest.spyOn(authenticationAccountSpy, 'authenticate').mockImplementationOnce(throwError)
    const result = await sut.handle(mockAuthenticationAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })
})
