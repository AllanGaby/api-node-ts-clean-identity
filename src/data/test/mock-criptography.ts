import { Hasher, HashComparer, ComparerDTO } from '@/data/protocols/criptography'

export class HasherSpy implements Hasher {
  payload: string
  hash: string

  async createHash (payload: string): Promise<string> {
    this.payload = payload
    return this.hash
  }
}

export class HashComparerSpy implements HashComparer {
  isValidHash: boolean = true
  compareParams: ComparerDTO

  async compare (params: ComparerDTO): Promise<boolean> {
    this.compareParams = params
    return this.isValidHash
  }
}
