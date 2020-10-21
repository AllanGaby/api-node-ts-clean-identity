export interface HashCreator{
  createHash: (payload: string) => Promise<string>
}
