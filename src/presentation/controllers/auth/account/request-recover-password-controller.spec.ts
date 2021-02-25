import { RequestRecoverPasswordController } from './request-recover-password-controller'
import { ValidationCompositeSpy } from '@/validation/tests'
import { RequestRecoverPasswordSpy, mockRequestRecoverPasswordRequest } from '@/presentation/tests/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/tests'

interface sutTypes {
  sut: RequestRecoverPasswordController
  validationCompositeSpy: ValidationCompositeSpy
  requestRecoverPasswordSpy: RequestRecoverPasswordSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const requestRecoverPasswordSpy = new RequestRecoverPasswordSpy()
  const sut = new RequestRecoverPasswordController(validationCompositeSpy, requestRecoverPasswordSpy)
  return {
    sut,
    validationCompositeSpy,
    requestRecoverPasswordSpy
  }
}

describe('RequestRecoverPasswordController', () => {
  test('Should call validations with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockRequestRecoverPasswordRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.body)
  })

  test('Should return BadRequest if validations is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validations fails')
    const result = await sut.handle(mockRequestRecoverPasswordRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call RequestRecoverPassword with correct values', async () => {
    const { sut, requestRecoverPasswordSpy } = makeSut()
    const request = mockRequestRecoverPasswordRequest()
    await sut.handle(request)
    expect(requestRecoverPasswordSpy.params).toEqual(request.body)
  })

  test('Should return ServerError if RequestRecoverPassword throws', async () => {
    const { sut, requestRecoverPasswordSpy } = makeSut()
    jest.spyOn(requestRecoverPasswordSpy, 'request').mockImplementationOnce(throwError)
    const result = await sut.handle(mockRequestRecoverPasswordRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Ok if RequestRecoverPassword succeeds', async () => {
    const { sut, requestRecoverPasswordSpy } = makeSut()
    const result = await sut.handle(mockRequestRecoverPasswordRequest())
    expect(result).toEqual(ok(requestRecoverPasswordSpy.session))
  })
})
