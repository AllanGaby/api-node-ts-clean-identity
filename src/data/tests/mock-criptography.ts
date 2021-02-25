import { HashCreator, HashComparer, ComparerDTO, Encrypter, Decrypter } from '@/data/protocols/criptography'
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

export class DecrypterSpy implements Decrypter {
  plainText: string = faker.random.uuid()
  encryptedText: string

  async decrypt (encryptedText: string): Promise<string> {
    this.encryptedText = encryptedText
    return this.plainText
  }
}
