import { CreateAccountController } from './create-account'
import { ValidationCompositeSpy } from '@/validation/test'
import { CreateAccountSpy, mockCreateAccountRequest } from '@/presentation/test/auth'

interface sutTypes {
  sut: CreateAccountController
  validationCompositeSpy: ValidationCompositeSpy
  createAccountSpy: CreateAccountSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(undefined)
  const createAccountSpy = new CreateAccountSpy()
  const sut = new CreateAccountController(validationCompositeSpy)
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
})
