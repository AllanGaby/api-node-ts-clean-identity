import { UpdateAccountController } from './update-account-controller'
import { ValidationCompositeSpy } from '@/validation/test'
import { UpdateAccountSpy, mockUpdateAccountRequest } from '@/presentation/test/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/test'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: UpdateAccountController
  validationCompositeSpy: ValidationCompositeSpy
  updateAccountSpy: UpdateAccountSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const updateAccountSpy = new UpdateAccountSpy()
  const sut = new UpdateAccountController(validationCompositeSpy, updateAccountSpy)
  return {
    sut,
    validationCompositeSpy,
    updateAccountSpy
  }
}

describe('UpdateAccountController', () => {
  test('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockUpdateAccountRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.body)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockUpdateAccountRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call UpdateAccount with correct values', async () => {
    const { sut, updateAccountSpy } = makeSut()
    const request = mockUpdateAccountRequest()
    await sut.handle(request)
    expect(updateAccountSpy.params).toEqual({
      id: request.body.session.accountId,
      name: request.body.name,
      email: request.body.email,
      password: request.body.password
    })
  })

  test('Should return badRequest if UpdateAccount return InvalidCredentialError', async () => {
    const { sut, updateAccountSpy } = makeSut()
    jest.spyOn(updateAccountSpy, 'update').mockImplementationOnce(() => { throw new InvalidCredentialsError() })
    const result = await sut.handle(mockUpdateAccountRequest())
    expect(result).toEqual(badRequest(new InvalidCredentialsError()))
  })

  test('Should return ServerError if UpdateAccount throws', async () => {
    const { sut, updateAccountSpy } = makeSut()
    jest.spyOn(updateAccountSpy, 'update').mockImplementationOnce(throwError)
    const result = await sut.handle(mockUpdateAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return ok and updated account if succeeds', async () => {
    const { sut, updateAccountSpy } = makeSut()
    const result = await sut.handle(mockUpdateAccountRequest())
    expect(result).toEqual(ok(updateAccountSpy.account))
  })
})
