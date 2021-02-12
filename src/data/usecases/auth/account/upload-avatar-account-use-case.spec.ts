import { DbUploadAvatarAccountUseCase } from './upload-avatar-account-use-case'
import { GetAccountByIdRepositorySpy, mockUploadAvatarAccountDTO, throwError } from '@/data/test'
import { UploadFileUseCaseSpy } from '@/data/test/files'

interface sutTypes {
  sut: DbUploadAvatarAccountUseCase
  getAccountByIdRepository: GetAccountByIdRepositorySpy
  uploadFileUseCase: UploadFileUseCaseSpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepository = new GetAccountByIdRepositorySpy()
  const uploadFileUseCase = new UploadFileUseCaseSpy()
  const sut = new DbUploadAvatarAccountUseCase(getAccountByIdRepository, uploadFileUseCase)
  return {
    sut,
    getAccountByIdRepository,
    uploadFileUseCase
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
})
