import { DbShowFileUseCase } from './show-file-use-case'
import { ShowFileRepositorySpy } from '@/data/test/files'
import faker from 'faker'
import { throwError } from '@/data/test'

interface sutTypes {
  sut: DbShowFileUseCase
  showFileRepository: ShowFileRepositorySpy
}

const makeSut = (): sutTypes => {
  const showFileRepository = new ShowFileRepositorySpy()
  const sut = new DbShowFileUseCase(showFileRepository)
  return {
    sut,
    showFileRepository
  }
}

describe('DbShowFileUseCase', () => {
  test('Should call ShowFileRepository with correct value', async () => {
    const { sut, showFileRepository } = makeSut()
    const fileId = faker.random.uuid()
    await sut.show(fileId)
    expect(showFileRepository.fileId).toBe(fileId)
  })

  test('Should return throw if ShowFileRepository throws', async () => {
    const { sut, showFileRepository } = makeSut()
    jest.spyOn(showFileRepository, 'show').mockImplementationOnce(throwError)
    const promise = sut.show(faker.random.uuid())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a fileModel if ShowFileRepository return fileModel', async () => {
    const { sut, showFileRepository } = makeSut()
    const file = await sut.show(faker.random.uuid())
    expect(file).toEqual(showFileRepository.file)
  })

  test('Should return undefined if ShowFileRepository return undefined', async () => {
    const { sut, showFileRepository } = makeSut()
    showFileRepository.file = undefined
    const file = await sut.show(faker.random.uuid())
    expect(file).toBeFalsy()
  })
})
