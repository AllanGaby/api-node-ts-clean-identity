import { HashCreator, HashComparer, ComparerDTO, Encrypter } from '@/data/protocols/criptography'
import faker from 'faker'

export class HashCreatorSpy implements HashCreator {
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

export class EncrypterSpy implements Encrypter {
  plainText: string
  encryptedText: string = faker.random.uuid()

  async encrypt (plainText: string): Promise<string> {
    this.plainText = plainText
    return this.encryptedText
  }
}
