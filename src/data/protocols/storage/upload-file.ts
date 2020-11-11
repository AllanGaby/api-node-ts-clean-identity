export interface UploadFileDTO {
  sourceFile: string
  destinationFile: string
}

export interface UploadFile {
  upload: (data: UploadFileDTO) => Promise<boolean>
}
