import { SetAccountTypeController } from './set-account-type'
import { ValidationCompositeSpy } from '@/validation/test'
import { SetAccountTypeSpy, mockSetAccountTypeRequest } from '@/presentation/test/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/test'

interface sutTypes {
  sut: SetAccountTypeController
  validationCompositeSpy: ValidationCompositeSpy
  setAccountTypeSpy: SetAccountTypeSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const setAccountTypeSpy = new SetAccountTypeSpy()
  const sut = new SetAccountTypeController(validationCompositeSpy, setAccountTypeSpy)
  return {
    sut,
    validationCompositeSpy,
    setAccountTypeSpy
  }
}

describe('SetAccountTypeController', () => {
  test('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockSetAccountTypeRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.body)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockSetAccountTypeRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call SetAccountType with correct values', async () => {
    const { sut, setAccountTypeSpy } = makeSut()
    const request = mockSetAccountTypeRequest()
    await sut.handle(request)
    expect(setAccountTypeSpy.params).toEqual(request.body)
  })

  test('Should return ServerError if SetAccountType throws', async () => {
    const { sut, setAccountTypeSpy } = makeSut()
    jest.spyOn(setAccountTypeSpy, 'setAccountType').mockImplementationOnce(throwError)
    const result = await sut.handle(mockSetAccountTypeRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return ok and updated account if succeeds', async () => {
    const { sut, setAccountTypeSpy } = makeSut()
    const result = await sut.handle(mockSetAccountTypeRequest())
    expect(result).toEqual(ok(setAccountTypeSpy.account))
  })
})
