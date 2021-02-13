import { DbShowAvatarAccountUseCase } from './show-avatar-account-use-case'
import { ShowFileRepositorySpy } from '@/data/test/files'
import { mockShowAvatarAccountDTO, throwError } from '@/data/test'

interface sutTypes {
  sut: DbShowAvatarAccountUseCase
  showFileRepository: ShowFileRepositorySpy
}

const makeSut = (): sutTypes => {
  const showFileRepository = new ShowFileRepositorySpy()
  const sut = new DbShowAvatarAccountUseCase(showFileRepository)
  return {
    sut,
    showFileRepository
  }
}

describe('DbShowAvatarAccountUseCase', () => {
  test('Shuld call ShowFileRepository with correct value', async () => {
    const { sut, showFileRepository } = makeSut()
    const request = mockShowAvatarAccountDTO()
    await sut.show(request)
    expect(showFileRepository.fileId).toBe(request.fileId)
  })

  test('Shuld return throw if ShowFileRepository throws', async () => {
    const { sut, showFileRepository } = makeSut()
    jest.spyOn(showFileRepository, 'show').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAvatarAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Shuld return throw if ShowFileRepository throws', async () => {
    const { sut, showFileRepository } = makeSut()
    const file = await sut.show(mockShowAvatarAccountDTO())
    expect(file).toEqual(showFileRepository.file)
  })
})
