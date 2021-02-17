import { DbDeleteAvatarAccountUseCase } from './delete-avatar-account-use-case'
import { CacheRemoveSpy, GetAccountByIdRepositorySpy, mockDeleteAvatarAccountDTO, throwError, UpdateAccountRepositorySpy } from '@/data/test'
import { DeleteFileUseCaseStub } from '@/data/test/files'
import { AccountNotFoundError } from '@/data/errors'

interface sutTypes {
  sut: DbDeleteAvatarAccountUseCase
  getAccountByIdRepository: GetAccountByIdRepositorySpy
  deleteFileUseCase: DeleteFileUseCaseStub
  updateAccountRepository: UpdateAccountRepositorySpy
  cacheRemoveSpy: CacheRemoveSpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepository = new GetAccountByIdRepositorySpy()
  const deleteFileUseCase = new DeleteFileUseCaseStub()
  const updateAccountRepository = new UpdateAccountRepositorySpy()
  const cacheRemoveSpy = new CacheRemoveSpy()
  const sut = new DbDeleteAvatarAccountUseCase(getAccountByIdRepository, deleteFileUseCase, updateAccountRepository, cacheRemoveSpy)
  return {
    sut,
    getAccountByIdRepository,
    deleteFileUseCase,
    updateAccountRepository,
    cacheRemoveSpy
  }
}

describe('DbDeleteAvatarAccountUseCase', () => {
  test('Should call GetAccountByIdRepository with correct values', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    const request = mockDeleteAvatarAccountDTO()
    await sut.delete(request)
    expect(getAccountByIdRepository.accountId).toBe(request.accountId)
  })

  test('Should return throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    jest.spyOn(getAccountByIdRepository, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.delete(mockDeleteAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AccountNotFoundError if GetAccountByIdRepository return undefined', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    getAccountByIdRepository.account = undefined
    const promise = sut.delete(mockDeleteAvatarAccountDTO())
    await expect(promise).rejects.toThrowError(AccountNotFoundError)
  })

  test('Should not call DeleteFile if account dont have avatar file', async () => {
    const { sut, getAccountByIdRepository, deleteFileUseCase } = makeSut()
    getAccountByIdRepository.account.avatar_file_id = undefined
    const deleteSpyon = jest.spyOn(deleteFileUseCase, 'delete')
    await sut.delete(mockDeleteAvatarAccountDTO())
    expect(deleteSpyon).not.toHaveBeenCalled()
  })

  test('Should call DeleteFile with correct values if account have avatar file', async () => {
    const { sut, getAccountByIdRepository, deleteFileUseCase } = makeSut()
    await sut.delete(mockDeleteAvatarAccountDTO())
    expect(deleteFileUseCase.fileId).toBe(getAccountByIdRepository.account.avatar_file_id)
  })

  test('Should return throw if DeleteFile throws', async () => {
    const { sut, deleteFileUseCase } = makeSut()
    jest.spyOn(deleteFileUseCase, 'delete').mockImplementationOnce(throwError)
    const promise = sut.delete(mockDeleteAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, updateAccountRepository, getAccountByIdRepository } = makeSut()
    const request = mockDeleteAvatarAccountDTO()
    await sut.delete(request)
    expect(updateAccountRepository.params).toEqual({
      ...getAccountByIdRepository.account,
      avatar_file_id: undefined
    })
  })

  test('Should return throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepository } = makeSut()
    jest.spyOn(updateAccountRepository, 'update').mockImplementationOnce(throwError)
    const promise = sut.delete(mockDeleteAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CacheRemove with correct value', async () => {
    const { sut, cacheRemoveSpy, updateAccountRepository } = makeSut()
    await sut.delete(mockDeleteAvatarAccountDTO())
    expect(cacheRemoveSpy.key).toBe(`account:${updateAccountRepository.account.email}`)
  })

  test('Should return throw if CacheRemove throws', async () => {
    const { sut, cacheRemoveSpy } = makeSut()
    jest.spyOn(cacheRemoveSpy, 'remove').mockImplementationOnce(throwError)
    const promise = sut.delete(mockDeleteAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})
