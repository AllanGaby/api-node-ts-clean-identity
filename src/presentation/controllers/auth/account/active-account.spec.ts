import { ActiveAccountController } from './active-account'
import { ValidationCompositeSpy } from '@/validation/test'
import { ActiveAccountSpy, mockActiveAccountRequest } from '@/presentation/test/auth'
import { badRequest } from '@/presentation/helpers'

interface sutTypes {
  sut: ActiveAccountController
  validationCompositeSpy: ValidationCompositeSpy
  activeAccountSpy: ActiveAccountSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const activeAccountSpy = new ActiveAccountSpy()
  const sut = new ActiveAccountController(validationCompositeSpy)

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
    expect(validationCompositeSpy.params).toEqual(request.body)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockActiveAccountRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })
})
