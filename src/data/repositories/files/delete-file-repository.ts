export interface DeleteFileRepository {
  delete: (fileId: string) => Promise<void>
}
