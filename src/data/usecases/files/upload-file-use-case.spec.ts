import { DbUploadFileUseCase } from './upload-file-use-case'
import { CreateFileRepositorySpy, mockUploadFileDTO, throwError, UploadStorageFileSpy } from '@/data/tests'
import path from 'path'
import faker from 'faker'

interface sutTypes {
  sut: DbUploadFileUseCase
  createFileRepositorySpy: CreateFileRepositorySpy
  uploadDir: string
  uploadFileSpy: UploadStorageFileSpy
}

const makeSut = (): sutTypes => {
  const createFileRepositorySpy = new CreateFileRepositorySpy()
  const uploadDir = faker.system.directoryPath()
  const uploadFileSpy = new UploadStorageFileSpy()
  const sut = new DbUploadFileUseCase(createFileRepositorySpy, uploadDir, uploadFileSpy)
  return {
    sut,
    createFileRepositorySpy,
    uploadDir,
    uploadFileSpy
  }
}

describe('DbUploadFileUseCase', () => {
  test('Should call CreateFileRepository with correct values', async () => {
    const { sut, createFileRepositorySpy, uploadDir } = makeSut()
    const request = mockUploadFileDTO()
    const extention = path.extname(request.filePath)
    await sut.upload(request)
    expect(createFileRepositorySpy.params).toEqual({
      dir: uploadDir,
      extention
    })
  })

  test('Should return throw if CreateFileRepository throws', async () => {
    const { sut, createFileRepositorySpy } = makeSut()
    jest.spyOn(createFileRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.upload(mockUploadFileDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UploadFile with correct values', async () => {
    const { sut, createFileRepositorySpy, uploadDir, uploadFileSpy } = makeSut()
    const request = mockUploadFileDTO()
    const fileExtention = path.extname(request.filePath)
    await sut.upload(request)
    expect(uploadFileSpy.uploadParams).toEqual({
      sourceFile: request.filePath,
      destinationFile: `${uploadDir}${createFileRepositorySpy.file.id}${fileExtention}`
    })
  })

  test('Should return throw if UploadFile throws', async () => {
    const { sut, uploadFileSpy } = makeSut()
    jest.spyOn(uploadFileSpy, 'upload').mockImplementationOnce(throwError)
    const promise = sut.upload(mockUploadFileDTO())
    await expect(promise).rejects.toThrow()
  })
})
