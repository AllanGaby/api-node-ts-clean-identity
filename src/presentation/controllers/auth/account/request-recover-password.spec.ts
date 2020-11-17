import { RequestRecoverPasswordController } from './request-recover-password'
import { ValidationCompositeSpy } from '@/validation/test'
import { RequestRecoverPasswordSpy, mockRequestRecoverPasswordRequest } from '@/presentation/test/auth'
import { badRequest } from '@/presentation/helpers'

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
})
