import { UploadFile, UploadFileDTO } from '@/data/protocols/storage'

export class UploadFileSpy implements UploadFile {
  uploadParams: UploadFileDTO
  isUploaded: boolean = false

  async upload (params: UploadFileDTO): Promise<boolean> {
    this.uploadParams = params
    return this.isUploaded
  }
}
