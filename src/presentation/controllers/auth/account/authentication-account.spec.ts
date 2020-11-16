import { AuthenticationAccountController } from './authentication-account'
import { ValidationCompositeSpy } from '@/validation/test'
import { AuthenticationAccountSpy, mockAuthenticationAccountRequest } from '@/presentation/test/auth'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers'
import { throwError } from '@/data/test'
import { InvalidCredentialsError } from '@/data/errors'

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

describe('AuthenticationAcc/ountController', () => {
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

  test('Should return ServerError if AuthenticationAccount usecase throws', async () => {
    const { sut, authenticationAccountSpy } = makeSut()
    jest.spyOn(authenticationAccountSpy, 'authenticate').mockImplementationOnce(throwError)
    const result = await sut.handle(mockAuthenticationAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Unauthorized if AuthenticationAccount return InvalidCredentials', async () => {
    const { sut, authenticationAccountSpy } = makeSut()
    jest.spyOn(authenticationAccountSpy, 'authenticate').mockImplementationOnce(() => { throw new InvalidCredentialsError() })
    const result = await sut.handle(mockAuthenticationAccountRequest())
    expect(result).toEqual(unauthorized(new InvalidCredentialsError()))
  })

  test('Should return Ok and correct entity if usecase is succeeds', async () => {
    const { sut, authenticationAccountSpy } = makeSut()
    const result = await sut.handle(mockAuthenticationAccountRequest())
    expect(result).toEqual(ok(authenticationAccountSpy.authentication))
  })
})
