import { RecoverPasswordController } from './recover-password-controller'
import { ValidationCompositeSpy } from '@/validation/tests'
import { RecoverPasswordSpy, mockRecoverPasswordRequest } from '@/presentation/tests/auth'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/data/tests'

interface sutTypes {
  sut: RecoverPasswordController
  validationCompositeSpy: ValidationCompositeSpy
  recoverPasswordSpy: RecoverPasswordSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const recoverPasswordSpy = new RecoverPasswordSpy()
  const sut = new RecoverPasswordController(validationCompositeSpy, recoverPasswordSpy)
  return {
    sut,
    validationCompositeSpy,
    recoverPasswordSpy
  }
}

describe('RecoverPasswordController', () => {
  test('Should call validations with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockRecoverPasswordRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.body)
  })

  test('Should return BadRequest if validations is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validations fails')
    const result = await sut.handle(mockRecoverPasswordRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call RecoverPassword with correct values', async () => {
    const { sut, recoverPasswordSpy } = makeSut()
    const request = mockRecoverPasswordRequest()
    await sut.handle(request)
    expect(recoverPasswordSpy.params).toEqual({
      sessionId: request.body.session_id,
      password: request.body.password
    })
  })

  test('Should return ServerError if RecoverPassword throws', async () => {
    const { sut, recoverPasswordSpy } = makeSut()
    jest.spyOn(recoverPasswordSpy, 'recover').mockImplementationOnce(throwError)
    const result = await sut.handle(mockRecoverPasswordRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Ok and account updated if RecoverPassword succeeds', async () => {
    const { sut, recoverPasswordSpy } = makeSut()
    const result = await sut.handle(mockRecoverPasswordRequest())
    expect(result).toEqual(ok(recoverPasswordSpy.account))
  })
})
