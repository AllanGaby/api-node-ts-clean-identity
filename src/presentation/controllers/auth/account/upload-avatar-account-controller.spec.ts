import { UploadAvatarAccountController } from './upload-avatar-account-controller'
import { ValidationCompositeSpy } from '@/validation/test'
import { UploadAvatarAccountUseCaseSpy, mockUploadAvatarAccountRequest } from '@/presentation/test/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/test'

interface sutTypes {
  sut: UploadAvatarAccountController
  validationCompositeSpy: ValidationCompositeSpy
  uploadAvatarAccount: UploadAvatarAccountUseCaseSpy
}

const makeSut = (): sutTypes => {
  const validationCompositeSpy = new ValidationCompositeSpy(null)
  const uploadAvatarAccount = new UploadAvatarAccountUseCaseSpy()
  const sut = new UploadAvatarAccountController(validationCompositeSpy, uploadAvatarAccount)
  return {
    sut,
    validationCompositeSpy,
    uploadAvatarAccount
  }
}

describe('UploadAvatarAccountController', () => {
  test('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const request = mockUploadAvatarAccountRequest()
    await sut.handle(request)
    expect(validationCompositeSpy.params).toEqual(request.body)
  })

  test('Should return BadRequest if validation is fails', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    validationCompositeSpy.error = new Error('Validation error')
    const result = await sut.handle(mockUploadAvatarAccountRequest())
    expect(result).toEqual(badRequest(validationCompositeSpy.error))
  })

  test('Should call UpdateAccount with correct values', async () => {
    const { sut, uploadAvatarAccount } = makeSut()
    const request = mockUploadAvatarAccountRequest()
    await sut.handle(request)
    expect(uploadAvatarAccount.params).toEqual({
      accountId: request.body.session.accountId,
      avatarFilePath: request.body.avatar_file_path
    })
  })

  test('Should return ServerError if UpdateAccount throws', async () => {
    const { sut, uploadAvatarAccount } = makeSut()
    jest.spyOn(uploadAvatarAccount, 'upload').mockImplementationOnce(throwError)
    const result = await sut.handle(mockUploadAvatarAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return ok and updated account if succeeds', async () => {
    const { sut, uploadAvatarAccount } = makeSut()
    const result = await sut.handle(mockUploadAvatarAccountRequest())
    expect(result).toEqual(ok(uploadAvatarAccount.account))
  })
})
