import { CreateAccountController } from './create-account-controller'
import { ValidationCompositeSpy } from '@/validation/tests'
import { CreateAccountSpy, mockCreateAccountRequest } from '@/presentation/tests/auth'
import { badRequest, created, forbidden, serverError } from '@/presentation/helpers'
import { throwError } from '@/data/tests'
import { EmailInUseError } from '@/data/errors'

interface sutTypes {
  sut: CreateAccountController
  validationCompositeSpy: ValidationCompositeSpy
  createAccountSpy: CreateAccountSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(undefined)
  const createAccountSpy = new CreateAccountSpy()
  const sut = new CreateAccountController(validationCompositeSpy, createAccountSpy)
  return {
    sut,
    validationCompositeSpy,
    createAccountSpy
  }
}

describe('CreateAccountController', () => {
  test('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockCreateAccountRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.body)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockCreateAccountRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call CreateAccount usecase with correct values', async () => {
    const { sut, createAccountSpy } = makeSut()
    const request = mockCreateAccountRequest()
    await sut.handle(request)
    expect(createAccountSpy.params).toEqual({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password
    })
  })

  test('Should return ServerError if CreateAccount usecase throws', async () => {
    const { sut, createAccountSpy } = makeSut()
    jest.spyOn(createAccountSpy, 'create').mockImplementationOnce(throwError)
    const result = await sut.handle(mockCreateAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Forbidden if exists other account with same e-mail', async () => {
    const { sut, createAccountSpy } = makeSut()
    jest.spyOn(createAccountSpy, 'create').mockImplementationOnce(() => { throw new EmailInUseError() })
    const error = await sut.handle(mockCreateAccountRequest())
    expect(error).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return Created and correct entity if usecase is succeeds', async () => {
    const { sut, createAccountSpy } = makeSut()
    const result = await sut.handle(mockCreateAccountRequest())
    expect(result).toEqual(created(createAccountSpy.session))
  })
})
