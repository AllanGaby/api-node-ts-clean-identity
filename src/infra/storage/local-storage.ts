import { UploadStorageFile, UploadStorageFileDTO, DeleteStorageFile, DeleteStorageFileDTO } from '@/data/protocols/storage'
import fs from 'fs'
import path from 'path'

export interface LocalStorageConfig {
  temporaryDir: string
  uploadDir: string
}

export class LocalStorage implements UploadStorageFile, DeleteStorageFile {
  constructor (private readonly config: LocalStorageConfig) {}

  async upload ({ sourceFile, destinationFile }: UploadStorageFileDTO): Promise<boolean> {
    const sourceFilePath = path.resolve(this.config.temporaryDir, sourceFile)
    const destinationFilePath = path.resolve(
      this.config.uploadDir,
      destinationFile
    )
    await fs.promises.rename(sourceFilePath, destinationFilePath)
    return true
  }

  async delete ({ filePath }: DeleteStorageFileDTO): Promise<void> {
    await fs.promises.unlink(filePath)
  }
}
