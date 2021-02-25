import { UploadStorageFile, UploadStorageFileDTO, DeleteStorageFile, DeleteStorageFileDTO } from '@/data/protocols/storage'

export class UploadStorageFileSpy implements UploadStorageFile {
  uploadParams: UploadStorageFileDTO
  isUploaded: boolean = false

  async upload (params: UploadStorageFileDTO): Promise<boolean> {
    this.uploadParams = params
    return this.isUploaded
  }
}

export class DeleteStorageFileStub implements DeleteStorageFile {
  params: DeleteStorageFileDTO

  async delete (params: DeleteStorageFileDTO): Promise<void> {
    this.params = params
  }
}
