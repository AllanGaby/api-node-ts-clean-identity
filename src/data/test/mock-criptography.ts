import { Hasher } from '@/data/protocols/criptography/hasher'

export class HasherSpy implements Hasher {
  payload: string
  hash: string

  async createHash (payload: string): Promise<string> {
    this.payload = payload
    return this.hash
  }
}
