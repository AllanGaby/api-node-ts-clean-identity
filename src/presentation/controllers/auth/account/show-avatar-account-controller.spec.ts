import { ShowAvatarAccountController } from './show-avatar-account-controller'
import { ValidationCompositeSpy } from '@/validation/test'
import { mockShowAvatarAccountRequest, ShowAvatarAccountUseCaseSpy } from '@/presentation/test/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/test'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: ShowAvatarAccountController
  validationCompositeSpy: ValidationCompositeSpy
  showAvatarAccount: ShowAvatarAccountUseCaseSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const showAvatarAccount = new ShowAvatarAccountUseCaseSpy()
  const sut = new ShowAvatarAccountController(validationCompositeSpy, showAvatarAccount)

  return {
    sut,
    validationCompositeSpy,
    showAvatarAccount
  }
}

describe('ShowAvatarAccountController', () => {
  test('Should call validations with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockShowAvatarAccountRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.params)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockShowAvatarAccountRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call ShowAvatarAccount with correct values', async () => {
    const { sut, showAvatarAccount } = makeSut()
    const request = mockShowAvatarAccountRequest()
    await sut.handle(request)
    expect(showAvatarAccount.params).toEqual({
      fileId: request.params.avatar_id
    })
  })

  test('Should return ServerError if ShowAvatarAccount usecase throws', async () => {
    const { sut, showAvatarAccount } = makeSut()
    jest.spyOn(showAvatarAccount, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockShowAvatarAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return BadRequest if ShowAvatarAccount return InvalidCredentialsError', async () => {
    const { sut, showAvatarAccount } = makeSut()
    jest.spyOn(showAvatarAccount, 'show').mockImplementationOnce(() => { throw new InvalidCredentialsError() })
    const result = await sut.handle(mockShowAvatarAccountRequest())
    expect(result).toEqual(badRequest(new InvalidCredentialsError()))
  })

  test('Should return Ok and correct entity if usecase is succeeds', async () => {
    const { sut, showAvatarAccount } = makeSut()
    const result = await sut.handle(mockShowAvatarAccountRequest())
    expect(result).toEqual(ok(showAvatarAccount.file))
  })
})
