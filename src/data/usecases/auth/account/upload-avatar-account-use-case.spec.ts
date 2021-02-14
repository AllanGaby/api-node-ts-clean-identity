import { DbUploadAvatarAccountUseCase } from './upload-avatar-account-use-case'
import { CacheRemoveSpy, GetAccountByIdRepositorySpy, mockUploadAvatarAccountDTO, throwError, UpdateAccountRepositorySpy } from '@/data/test'
import { DeleteFileUseCaseStub, UploadFileUseCaseSpy } from '@/data/test/files'
import { AccountNotFoundError } from '@/data/errors'

interface sutTypes {
  sut: DbUploadAvatarAccountUseCase
  getAccountByIdRepository: GetAccountByIdRepositorySpy
  deleteFileUseCase: DeleteFileUseCaseStub
  uploadFileUseCase: UploadFileUseCaseSpy
  updateAccountRepository: UpdateAccountRepositorySpy
  cacheRemoveSpy: CacheRemoveSpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepository = new GetAccountByIdRepositorySpy()
  const deleteFileUseCase = new DeleteFileUseCaseStub()
  const uploadFileUseCase = new UploadFileUseCaseSpy()
  const updateAccountRepository = new UpdateAccountRepositorySpy()
  const cacheRemoveSpy = new CacheRemoveSpy()
  const sut = new DbUploadAvatarAccountUseCase(getAccountByIdRepository, deleteFileUseCase, uploadFileUseCase, updateAccountRepository, cacheRemoveSpy)
  return {
    sut,
    getAccountByIdRepository,
    deleteFileUseCase,
    uploadFileUseCase,
    updateAccountRepository,
    cacheRemoveSpy
  }
}

describe('DbUploadAvatarAccountUseCase', () => {
  test('Should call GetAccountByIdRepository with correct values', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    const request = mockUploadAvatarAccountDTO()
    await sut.upload(request)
    expect(getAccountByIdRepository.accountId).toBe(request.accountId)
  })

  test('Should return throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    jest.spyOn(getAccountByIdRepository, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.upload(mockUploadAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AccountNotFoundError if GetAccountByIdRepository return undefined', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    getAccountByIdRepository.account = undefined
    const promise = sut.upload(mockUploadAvatarAccountDTO())
    await expect(promise).rejects.toThrowError(AccountNotFoundError)
  })

  test('Should not call DeleteFile if account dont have avatar file', async () => {
    const { sut, getAccountByIdRepository, deleteFileUseCase } = makeSut()
    getAccountByIdRepository.account.avatar_file_id = undefined
    const deleteSpyon = jest.spyOn(deleteFileUseCase, 'delete')
    await sut.upload(mockUploadAvatarAccountDTO())
    expect(deleteSpyon).not.toHaveBeenCalled()
  })

  test('Should call DeleteFile with correct values if account have avatar file', async () => {
    const { sut, getAccountByIdRepository, deleteFileUseCase } = makeSut()
    await sut.upload(mockUploadAvatarAccountDTO())
    expect(deleteFileUseCase.fileId).toBe(getAccountByIdRepository.account.avatar_file_id)
  })

  test('Should return throw if DeleteFile throws', async () => {
    const { sut, deleteFileUseCase } = makeSut()
    jest.spyOn(deleteFileUseCase, 'delete').mockImplementationOnce(throwError)
    const promise = sut.upload(mockUploadAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UploadFile with correct values', async () => {
    const { sut, uploadFileUseCase } = makeSut()
    const request = mockUploadAvatarAccountDTO()
    await sut.upload(request)
    expect(uploadFileUseCase.params).toEqual({
      filePath: request.avatarFilePath
    })
  })

  test('Should return throw if UploadFile throws', async () => {
    const { sut, uploadFileUseCase } = makeSut()
    jest.spyOn(uploadFileUseCase, 'upload').mockImplementationOnce(throwError)
    const promise = sut.upload(mockUploadAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, updateAccountRepository, uploadFileUseCase, getAccountByIdRepository } = makeSut()
    const request = mockUploadAvatarAccountDTO()
    await sut.upload(request)
    expect(updateAccountRepository.params).toEqual({
      ...getAccountByIdRepository.account,
      avatar_file_id: uploadFileUseCase.file.id
    })
  })

  test('Should return throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepository } = makeSut()
    jest.spyOn(updateAccountRepository, 'update').mockImplementationOnce(throwError)
    const promise = sut.upload(mockUploadAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CacheRemove with correct value', async () => {
    const { sut, cacheRemoveSpy, updateAccountRepository } = makeSut()
    await sut.upload(mockUploadAvatarAccountDTO())
    expect(cacheRemoveSpy.key).toBe(`account:${updateAccountRepository.account.email}`)
  })

  test('Should return throw if CacheRemove throws', async () => {
    const { sut, cacheRemoveSpy } = makeSut()
    jest.spyOn(cacheRemoveSpy, 'remove').mockImplementationOnce(throwError)
    const promise = sut.upload(mockUploadAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})
