import { DbUploadAvatarAccountUseCase } from './upload-avatar-account-use-case'
import { GetAccountByIdRepositorySpy, mockUploadAvatarAccountDTO, throwError, UpdateAccountRepositorySpy } from '@/data/test'
import { UploadFileUseCaseSpy } from '@/data/test/files'
import { AccountNotFoundError } from '@/data/errors'

interface sutTypes {
  sut: DbUploadAvatarAccountUseCase
  getAccountByIdRepository: GetAccountByIdRepositorySpy
  uploadFileUseCase: UploadFileUseCaseSpy
  updateAccountRepository: UpdateAccountRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepository = new GetAccountByIdRepositorySpy()
  const uploadFileUseCase = new UploadFileUseCaseSpy()
  const updateAccountRepository = new UpdateAccountRepositorySpy()
  const sut = new DbUploadAvatarAccountUseCase(getAccountByIdRepository, uploadFileUseCase, updateAccountRepository)
  return {
    sut,
    getAccountByIdRepository,
    uploadFileUseCase,
    updateAccountRepository
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
})
