import { MemoryFileRepository } from './file-repository'
import { mockCreateFileModel } from '@/data/test/files'

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
})
