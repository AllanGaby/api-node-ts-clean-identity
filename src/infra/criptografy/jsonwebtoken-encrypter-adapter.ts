import { Encrypter, Decrypter } from '@/data/protocols/criptography'
import { sign, verify } from 'jsonwebtoken'

interface TokenPayload {
  ait: number
  exp: number
  sub: string
}

export class JWTEncrypterAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string,
    private readonly deadlineInDays: number
  ) {}

  async encrypt (plainText: string): Promise<string> {
    return sign({}, this.secret, {
      subject: plainText,
      expiresIn: `${this.deadlineInDays}d`
    })
  }

  async decrypt (encryptedText: string): Promise<string> {
    const decoded = verify(encryptedText, this.secret) as TokenPayload
    return decoded.sub
  }
}
