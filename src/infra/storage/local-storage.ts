import { UploadFile, UploadFileDTO } from '@/data/protocols/storage'
import fs from 'fs'
import path from 'path'

export interface LocalStorageConfig {
  temporaryDir: string
  uploadDir: string
}

export class LocalStorage implements UploadFile {
  constructor (private readonly config: LocalStorageConfig) {}

  async upload ({ sourceFile, destinationFile }: UploadFileDTO): Promise<boolean> {
    const sourceFilePath = path.resolve(this.config.temporaryDir, sourceFile)
    const destinationFilePath = path.resolve(
      this.config.uploadDir,
      destinationFile
    )
    await fs.promises.rename(sourceFilePath, destinationFilePath)
    return true
  }
}
