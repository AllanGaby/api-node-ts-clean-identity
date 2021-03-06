import { ActiveAccountController } from './active-account-controller'
import { ValidationCompositeSpy } from '@/validation/tests'
import { ActiveAccountSpy, mockActiveAccountRequest } from '@/presentation/tests/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/tests'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: ActiveAccountController
  validationCompositeSpy: ValidationCompositeSpy
  activeAccountSpy: ActiveAccountSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const activeAccountSpy = new ActiveAccountSpy()
  const sut = new ActiveAccountController(validationCompositeSpy, activeAccountSpy)

  return {
    sut,
    validationCompositeSpy,
    activeAccountSpy
  }
}

describe('ActiveAccountController', () => {
  test('Should call validations with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockActiveAccountRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.params)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockActiveAccountRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call ActiveAccount with correct values', async () => {
    const { sut, activeAccountSpy } = makeSut()
    const request = mockActiveAccountRequest()
    await sut.handle(request)
    expect(activeAccountSpy.params).toEqual({
      sessionId: request.params.session_id
    })
  })

  test('Should return ServerError if ActiveAccount usecase throws', async () => {
    const { sut, activeAccountSpy } = makeSut()
    jest.spyOn(activeAccountSpy, 'active').mockImplementationOnce(throwError)
    const result = await sut.handle(mockActiveAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return BadRequest if ActiveAccount return InvalidCredentialsError', async () => {
    const { sut, activeAccountSpy } = makeSut()
    jest.spyOn(activeAccountSpy, 'active').mockImplementationOnce(() => { throw new InvalidCredentialsError() })
    const result = await sut.handle(mockActiveAccountRequest())
    expect(result).toEqual(badRequest(new InvalidCredentialsError()))
  })

  test('Should return Ok and correct entity if usecase is succeeds', async () => {
    const { sut, activeAccountSpy } = makeSut()
    const result = await sut.handle(mockActiveAccountRequest())
    expect(result).toEqual(ok(activeAccountSpy.account))
  })
})
