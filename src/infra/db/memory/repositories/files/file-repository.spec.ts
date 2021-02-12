import { MemoryFileRepository } from './file-repository'
import { mockCreateFileModel } from '@/data/test/files'
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
      expect(file.path).toBe(request.filePath)
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
      expect(file.path).toBe(request.filePath)
    })
  })
})
