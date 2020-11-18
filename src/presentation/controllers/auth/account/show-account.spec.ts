import { ShowAccountController } from './show-account'
import { ValidationCompositeSpy } from '@/validation/test'
import { ShowAccountSpy, mockShowAccountRequest } from '@/presentation/test/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/test'

interface sutTypes {
  sut: ShowAccountController
  validationCompositeSpy: ValidationCompositeSpy
  showAccountSpy: ShowAccountSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const showAccountSpy = new ShowAccountSpy()
  const sut = new ShowAccountController(validationCompositeSpy, showAccountSpy)
  return {
    sut,
    validationCompositeSpy,
    showAccountSpy
  }
}

describe('ShowAccountController', () => {
  test('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockShowAccountRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.body)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockShowAccountRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call ShowAccount with correct values', async () => {
    const { sut, showAccountSpy } = makeSut()
    const request = mockShowAccountRequest()
    await sut.handle(request)
    expect(showAccountSpy.params).toEqual(request.body)
  })

  test('Should return ServerError if ShowAccount throws', async () => {
    const { sut, showAccountSpy } = makeSut()
    jest.spyOn(showAccountSpy, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockShowAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return ok and updated account if succeeds', async () => {
    const { sut, showAccountSpy } = makeSut()
    const result = await sut.handle(mockShowAccountRequest())
    expect(result).toEqual(ok(showAccountSpy.account))
  })
})
