export interface Hasher{
  createHash: (payload: string) => Promise<string>
}
