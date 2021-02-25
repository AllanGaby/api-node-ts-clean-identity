import { DeleteAvatarAccountController } from './delete-avatar-account-controller'
import { DeleteAvatarAccountUseCaseSpy, mockDeleteAvatarAccountRequest } from '@/presentation/tests/auth'
import { serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/tests'

interface sutTypes {
  sut: DeleteAvatarAccountController
  deleteAvatarAccount: DeleteAvatarAccountUseCaseSpy
}

const makeSut = (): sutTypes => {
  const deleteAvatarAccount = new DeleteAvatarAccountUseCaseSpy()
  const sut = new DeleteAvatarAccountController(deleteAvatarAccount)
  return {
    sut,
    deleteAvatarAccount
  }
}

describe('DeleteAvatarAccountController', () => {
  test('Should call DeleteAvatar with correct values', async () => {
    const { sut, deleteAvatarAccount } = makeSut()
    const request = mockDeleteAvatarAccountRequest()
    await sut.handle(request)
    expect(deleteAvatarAccount.params).toEqual({
      accountId: request.body.session.accountId
    })
  })

  test('Should return ServerError if DeleteAvatar throws', async () => {
    const { sut, deleteAvatarAccount } = makeSut()
    jest.spyOn(deleteAvatarAccount, 'delete').mockImplementationOnce(throwError)
    const result = await sut.handle(mockDeleteAvatarAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return ok and updated account if succeeds', async () => {
    const { sut, deleteAvatarAccount } = makeSut()
    const result = await sut.handle(mockDeleteAvatarAccountRequest())
    expect(result).toEqual(ok(deleteAvatarAccount.account))
  })
})
