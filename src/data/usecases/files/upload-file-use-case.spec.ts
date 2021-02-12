import { CreateFileRepositorySpy, mockUploadFileDTO } from '@/data/test/files';
import { DbUploadFileUseCase } from './upload-file-use-case'
import { throwError, UploadFileSpy } from '@/data/test';
import path from 'path'

interface sutTypes {
  sut: DbUploadFileUseCase
  createFileRepositorySpy: CreateFileRepositorySpy
  uploadFileSpy: UploadFileSpy
}

const makeSut = (): sutTypes => {
  const uploadFileSpy = new UploadFileSpy()
  const createFileRepositorySpy = new CreateFileRepositorySpy()
  const sut = new DbUploadFileUseCase(createFileRepositorySpy, uploadFileSpy)
  return {
    sut,
    createFileRepositorySpy,
    uploadFileSpy
  }
}

describe('DbUploadFileUseCase', () => {
  test('Should call CreateFileRepository with correct values', async () => {
    const { sut, createFileRepositorySpy } = makeSut()
    const request = mockUploadFileDTO()
    const fileExtention = path.extname(request.filePath)
    createFileRepositorySpy.file.extention = fileExtention
    await sut.upload(request)
    expect(createFileRepositorySpy.params).toEqual({
      filePath: request.filePath,
      extension: fileExtention
    })
  })

  test('Should return throw if CreateFileRepository throws', async () => {
    const { sut, createFileRepositorySpy } = makeSut()
    jest.spyOn(createFileRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.upload(mockUploadFileDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UploadFile with correct values', async () => {
    const { sut, createFileRepositorySpy, uploadFileSpy } = makeSut()
    const request = mockUploadFileDTO()
    await sut.upload(request)
    expect(uploadFileSpy.uploadParams).toEqual({
      sourceFile: request.filePath,
      destinationFile: `${createFileRepositorySpy.file.id}.${createFileRepositorySpy.file.extention}`
    })
  })

  test('Should return throw if UploadFile throws', async () => {
    const { sut, uploadFileSpy } = makeSut()
    jest.spyOn(uploadFileSpy, 'upload').mockImplementationOnce(throwError)
    const promise = sut.upload(mockUploadFileDTO())
    await expect(promise).rejects.toThrow()
  })
})