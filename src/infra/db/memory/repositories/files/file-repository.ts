import { CreateFileRepository, CreateFileModel, ShowFileRepository, DeleteFileRepository } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'
import faker from 'faker'

export class MemoryFileRepository implements CreateFileRepository, ShowFileRepository, DeleteFileRepository {
  private readonly files: FileModel[]
  private static instance: MemoryFileRepository

  private constructor () {
    this.files = [
      this.addFile('default', 'uploads/auth/avatar/', '.png')
    ]
  }

  private addFile (id: string, dir: string, extention: string): FileModel {
    return {
      id,
      dir,
      extention,
      created_at: new Date()
    }
  }

  public static getInstance (): MemoryFileRepository {
    if (!MemoryFileRepository.instance) {
      MemoryFileRepository.instance = new MemoryFileRepository()
    }
    return MemoryFileRepository.instance
  }

  async create ({ dir, extention }: CreateFileModel): Promise<FileModel> {
    const file = this.addFile(
      faker.random.uuid(),
      dir,
      extention
    )
    this.files.push(file)
    return file
  }

  async show (fileId: string): Promise<FileModel> {
    return this.files.find(file => file.id === fileId)
  }

  async delete (fileId: string): Promise<void> {
    if (fileId) {
      const index = this.files.findIndex(session => session.id === fileId)
      if (index >= 0) {
        this.files.splice(index)
      }
    }
  }
}
