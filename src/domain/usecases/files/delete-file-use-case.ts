export interface DeleteFileUseCase {
  delete: (fileId: string) => Promise<void>
}
