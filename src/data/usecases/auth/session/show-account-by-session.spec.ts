import { DbShowAccountBySession } from './show-account-by-session'
import { DecrypterSpy, mockShowAccountBySessionDTO, throwError } from '@/data/test'

interface sutTypes {
  sut: DbShowAccountBySession
  decrypterSpy: DecrypterSpy
}

const makeSut = (): sutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const sut = new DbShowAccountBySession(decrypterSpy)
  return {
    sut,
    decrypterSpy
  }
}

describe('DbShowAccountBySession', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    const showAccountBySession = mockShowAccountBySessionDTO()
    await sut.show(showAccountBySession)
    expect(decrypterSpy.encryptedText).toBe(showAccountBySession.accessToken)
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAccountBySessionDTO())
    await expect(promise).rejects.toThrow()
  })
})
