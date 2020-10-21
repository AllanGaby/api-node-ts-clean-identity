export interface UploadFileDTO {
  sourceFilePath: string
  destinationFilePath: string
}

export interface UploadFile {
  upload: (data: UploadFileDTO) => Promise<boolean>
}
