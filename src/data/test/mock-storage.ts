import { UploadStorageFile, UploadStorageFileDTO } from '@/data/protocols/storage'

export class UploadStorageFileSpy implements UploadStorageFile {
  uploadParams: UploadStorageFileDTO
  isUploaded: boolean = false

  async upload (params: UploadStorageFileDTO): Promise<boolean> {
    this.uploadParams = params
    return this.isUploaded
  }
}
