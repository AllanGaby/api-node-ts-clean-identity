import { MemoryFileRepository } from './file-repository'
import { mockCreateFileModel, mockFileModel } from '@/data/test/files'
import faker from 'faker'

interface sutTypes {
  sut: MemoryFileRepository
}

const makeSut = (): sutTypes => ({
  sut: MemoryFileRepository.getInstance()
})

describe('MemoryFileRepository', () => {
  describe('Create Method', () => {
    test('Should return a new file with correct values', async () => {
      const { sut } = makeSut()
      const request = mockCreateFileModel()
      const file = await sut.create(request)
      expect(file.dir).toBe(request.dir)
      expect(file.extention).toBe(request.extention)
    })
  })

  describe('Show Method', () => {
    test('Should return undefined if file is not found', async () => {
      const { sut } = makeSut()
      const file = await sut.show(faker.random.uuid())
      expect(file).toBeFalsy()
    })

    test('Should return a fileModel if file is found', async () => {
      const { sut } = makeSut()
      const request = mockCreateFileModel()
      const createdFile = await sut.create(request)
      const file = await sut.show(createdFile.id)
      expect(file).toBeTruthy()
      expect(file.dir).toBe(request.dir)
      expect(file.extention).toBe(request.extention)
    })
  })

  describe('Delete Method', () => {
    test('Should return null if file not found', async () => {
      const { sut } = makeSut()
      const file = mockFileModel()
      const fileId = file.id
      const beforeFile = await sut.delete(fileId)
      expect(beforeFile).toBeFalsy()
      await sut.delete(fileId)
      const afterFile = await sut.show(fileId)
      expect(afterFile).toBeFalsy()
    })

    test('Should return null if fileId is undefined', async () => {
      const { sut } = makeSut()
      await sut.delete(undefined)
      const file = await sut.show(undefined)
      expect(file).toBeFalsy()
    })

    test('Should change file list if file found', async () => {
      const { sut } = makeSut()
      const createdFile = await sut.create(mockCreateFileModel())
      const existsFile = await sut.show(createdFile.id)
      expect(existsFile).toEqual(createdFile)
      await sut.delete(existsFile.id)
      expect(await sut.show(createdFile.id)).toBeFalsy()
      await sut.delete(existsFile.id)
      expect(await sut.show(createdFile.id)).toBeFalsy()
    })
  })
})
