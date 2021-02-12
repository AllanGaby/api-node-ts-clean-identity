import { CreateFileRepository, CreateFileModel } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'
import faker from 'faker'

export class MemoryFileRepository implements CreateFileRepository {
  private readonly files: FileModel[]
  private static instance: MemoryFileRepository

  private constructor () {
    this.files = []
  }

  public static getInstance (): MemoryFileRepository {
    if (!MemoryFileRepository.instance) {
      MemoryFileRepository.instance = new MemoryFileRepository()
    }
    return MemoryFileRepository.instance
  }

  async create ({ filePath }: CreateFileModel): Promise<FileModel> {
    const file: FileModel = {
      id: faker.random.uuid(),
      path: filePath,
      created_at: new Date()
    }
    this.files.push(file)
    return file
  }
}
