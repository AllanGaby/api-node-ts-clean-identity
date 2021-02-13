import { CreateFileRepository, CreateFileModel, ShowFileRepository } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'
import faker from 'faker'

export class MemoryFileRepository implements CreateFileRepository, ShowFileRepository {
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

  async create ({ dir, extention }: CreateFileModel): Promise<FileModel> {
    const file: FileModel = {
      id: faker.random.uuid(),
      dir,
      extention,
      created_at: new Date()
    }
    this.files.push(file)
    return file
  }

  async show (fileId: string): Promise<FileModel> {
    return this.files.find(file => file.id === fileId)
  }
}
