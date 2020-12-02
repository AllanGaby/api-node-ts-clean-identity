import { ShowAccountByIdController } from './show-account-by-id-controller'
import { ValidationCompositeSpy } from '@/validation/test'
import { ShowAccountSpy, mockShowAccountByIdRequest } from '@/presentation/test/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/test'

interface sutTypes {
  sut: ShowAccountByIdController
  validationCompositeSpy: ValidationCompositeSpy
  showAccountSpy: ShowAccountSpy
}

const makeSut = (): sutTypes => {
  const showAccountSpy = new ShowAccountSpy()
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const sut = new ShowAccountByIdController(validationCompositeSpy, showAccountSpy)
  return {
    sut,
    validationCompositeSpy,
    showAccountSpy
  }
}

describe('ShowAccountByIdController', () => {
  test('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockShowAccountByIdRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.params)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockShowAccountByIdRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call ShowAccount with correct values', async () => {
    const { sut, showAccountSpy } = makeSut()
    const request = mockShowAccountByIdRequest()
    await sut.handle(request)
    expect(showAccountSpy.params).toEqual({
      accountId: request.params.account_id
    })
  })

  test('Should return ServerError if ShowAccount throws', async () => {
    const { sut, showAccountSpy } = makeSut()
    jest.spyOn(showAccountSpy, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockShowAccountByIdRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return ok and updated account if succeeds', async () => {
    const { sut, showAccountSpy } = makeSut()
    const result = await sut.handle(mockShowAccountByIdRequest())
    expect(result).toEqual(ok(showAccountSpy.account))
  })
})
