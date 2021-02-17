import { DbShowAvatarAccountUseCase } from './show-avatar-account-use-case'
import { ShowFileRepositorySpy } from '@/data/test/files'
import { mockShowAvatarAccountDTO, throwError } from '@/data/test'
import faker from 'faker'

interface sutTypes {
  sut: DbShowAvatarAccountUseCase
  defaultAvatarPath: string
  showFileRepository: ShowFileRepositorySpy
}

const makeSut = (): sutTypes => {
  const showFileRepository = new ShowFileRepositorySpy()
  const defaultAvatarPath = faker.system.filePath()
  const sut = new DbShowAvatarAccountUseCase(showFileRepository, defaultAvatarPath)
  return {
    sut,
    showFileRepository,
    defaultAvatarPath
  }
}

describe('DbShowAvatarAccountUseCase', () => {
  test('Should call ShowFileRepository with correct value', async () => {
    const { sut, showFileRepository } = makeSut()
    const request = mockShowAvatarAccountDTO()
    await sut.show(request)
    expect(showFileRepository.fileId).toBe(request.fileId)
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
    const { sut, defaultAvatarPath } = makeSut()
    const filePath = await sut.show({
      fileId: undefined
    })
    expect(filePath).toBe(defaultAvatarPath)
  })
})
