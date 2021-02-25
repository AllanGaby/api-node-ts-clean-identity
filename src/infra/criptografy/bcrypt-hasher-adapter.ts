import { HashCreator, HashComparer, ComparerDTO } from '@/data/protocols/criptography'
import bcrypt from 'bcrypt'

export class BCrypterHasherAdapter implements HashCreator, HashComparer {
  constructor (private readonly salt: number) {}

  async createHash (payload: string): Promise<string> {
    return await bcrypt.hash(payload, this.salt)
  }

  async compare (data: ComparerDTO): Promise<boolean> {
    return await bcrypt.compare(data.payload, data.hashedText)
  }
}
