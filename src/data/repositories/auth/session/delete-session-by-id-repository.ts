export interface DeleteSessionByIdRepository {
  deleteById: (sessionId: string) => Promise<void>
}
