import { DbShowAvatarAccountUseCase } from './show-avatar-account-use-case'
import { ShowFileRepositorySpy } from '@/data/test/files'
import { GetAccountByIdRepositorySpy, mockShowAvatarAccountDTO, throwError } from '@/data/test'
import { AccountNotFoundError } from '@/data/errors'
import faker from 'faker'

interface sutTypes {
  sut: DbShowAvatarAccountUseCase
  defaultAvatarPath: string
  getAccountByIdRepository: GetAccountByIdRepositorySpy
  showFileRepository: ShowFileRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepository = new GetAccountByIdRepositorySpy()
  getAccountByIdRepository.account.avatar_file_id = faker.random.uuid()
  const showFileRepository = new ShowFileRepositorySpy()
  const defaultAvatarPath = faker.system.filePath()
  const sut = new DbShowAvatarAccountUseCase(getAccountByIdRepository, showFileRepository, defaultAvatarPath)
  return {
    sut,
    getAccountByIdRepository,
    showFileRepository,
    defaultAvatarPath
  }
}

describe('DbShowAvatarAccountUseCase', () => {
  test('Should call GetAccountByIdRepository with correct value', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    const request = mockShowAvatarAccountDTO()
    await sut.show(request)
    expect(getAccountByIdRepository.accountId).toBe(request.accountId)
  })

  test('Should return throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    jest.spyOn(getAccountByIdRepository, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AccountNotFound if GetAccountByIdRepository return undefined', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    getAccountByIdRepository.account = undefined
    const promise = sut.show(mockShowAvatarAccountDTO())
    await expect(promise).rejects.toThrowError(AccountNotFoundError)
  })

  test('Should call ShowFileRepository with correct value', async () => {
    const { sut, showFileRepository, getAccountByIdRepository } = makeSut()
    const request = mockShowAvatarAccountDTO()
    await sut.show(request)
    expect(showFileRepository.fileId).toBe(getAccountByIdRepository.account.avatar_file_id)
  })

  test('Should return throw if ShowFileRepository throws', async () => {
    const { sut, showFileRepository } = makeSut()
    jest.spyOn(showFileRepository, 'show').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return correct file path if file is found', async () => {
    const { sut, showFileRepository } = makeSut()
    const filePath = await sut.show(mockShowAvatarAccountDTO())
    expect(filePath).toBe(`${showFileRepository.file.dir}/${showFileRepository.file.id}${showFileRepository.file.extention}`)
  })

  test('Should return default avatar path if file is not found', async () => {
    const { sut, showFileRepository, defaultAvatarPath } = makeSut()
    showFileRepository.file = undefined
    const filePath = await sut.show(mockShowAvatarAccountDTO())
    expect(filePath).toBe(defaultAvatarPath)
  })

  test('Should return default avatar path if avatar id not found', async () => {
    const { sut, getAccountByIdRepository, defaultAvatarPath } = makeSut()
    getAccountByIdRepository.account.avatar_file_id = undefined
    const filePath = await sut.show(mockShowAvatarAccountDTO())
    expect(filePath).toBe(defaultAvatarPath)
  })
})
