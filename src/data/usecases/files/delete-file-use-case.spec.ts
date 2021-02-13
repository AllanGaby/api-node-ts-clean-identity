import { DbDeleteFileUseCase } from './delete-file-use-case'
import { ShowFileRepositorySpy, DeleteFileRepositoryStub } from '@/data/test/files'
import { DeleteStorageFileStub, throwError } from '@/data/test'
import faker from 'faker'
import { FileNotFoundError } from '@/data/errors'

interface sutTypes {
  sut: DbDeleteFileUseCase
  showFileRepository: ShowFileRepositorySpy
  deleteStorageFile: DeleteStorageFileStub
  deleteFileRepository: DeleteFileRepositoryStub
}

const makeSut = (): sutTypes => {
  const showFileRepository = new ShowFileRepositorySpy()
  const deleteStorageFile = new DeleteStorageFileStub()
  const deleteFileRepository = new DeleteFileRepositoryStub()
  const sut = new DbDeleteFileUseCase(showFileRepository, deleteStorageFile, deleteFileRepository)
  return {
    sut,
    showFileRepository,
    deleteStorageFile,
    deleteFileRepository
  }
}

describe('DbDeleteFileUseCase', () => {
  test('Should call ShowFileRepository with correct values', async () => {
    const { sut, showFileRepository } = makeSut()
    const fileId = faker.random.uuid()
    await sut.delete(fileId)
    expect(showFileRepository.fileId).toBe(fileId)
  })

  test('Should return throw if ShowFileRepository throws', async () => {
    const { sut, showFileRepository } = makeSut()
    jest.spyOn(showFileRepository, 'show').mockImplementationOnce(throwError)
    const promise = sut.delete(faker.random.uuid())
    await expect(promise).rejects.toThrow()
  })

  test('Should return FileNotFoundError if ShowFileRepository return undefined', async () => {
    const { sut, showFileRepository } = makeSut()
    showFileRepository.file = undefined
    const promise = sut.delete(faker.random.uuid())
    await expect(promise).rejects.toThrowError(FileNotFoundError)
  })

  test('Should call DeleteStorageFile with correct values', async () => {
    const { sut, showFileRepository, deleteStorageFile } = makeSut()
    await sut.delete(faker.random.uuid())
    expect(deleteStorageFile.params).toEqual({ filePath: `${showFileRepository.file.dir}${showFileRepository.file.id}${showFileRepository.file.extention}` })
  })

  test('Should return throw if DeleteStorageFile throws', async () => {
    const { sut, deleteStorageFile } = makeSut()
    jest.spyOn(deleteStorageFile, 'delete').mockImplementationOnce(throwError)
    const promise = sut.delete(faker.random.uuid())
    await expect(promise).rejects.toThrow()
  })

  test('Should call DeleteFileRepository with correct values', async () => {
    const { sut, showFileRepository, deleteFileRepository } = makeSut()
    await sut.delete(faker.random.uuid())
    expect(deleteFileRepository.fileId).toBe(showFileRepository.file.id)
  })

  test('Should return throw if DeleteFileRepository throws', async () => {
    const { sut, deleteFileRepository } = makeSut()
    jest.spyOn(deleteFileRepository, 'delete').mockImplementationOnce(throwError)
    const promise = sut.delete(faker.random.uuid())
    await expect(promise).rejects.toThrow()
  })
})
