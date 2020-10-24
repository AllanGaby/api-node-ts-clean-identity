import { DbShowAccountBySession } from './show-account-by-session'
import { DecrypterSpy, mockShowAccountBySessionDTO, throwError, GetSessionByIdRepositorySpy } from '@/data/test'

interface sutTypes {
  sut: DbShowAccountBySession
  decrypterSpy: DecrypterSpy
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const sut = new DbShowAccountBySession(decrypterSpy, getSessionByIdRepositorySpy)
  return {
    sut,
    decrypterSpy,
    getSessionByIdRepositorySpy
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

  test('Should return null if Decrypter return null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plainText = null
    const account = await sut.show(mockShowAccountBySessionDTO())
    expect(account).toBeFalsy()
  })

  test('Should call GetSessionByIdRepository with correct value', async () => {
    const { sut, decrypterSpy, getSessionByIdRepositorySpy } = makeSut()
    await sut.show(mockShowAccountBySessionDTO())
    expect(getSessionByIdRepositorySpy.sessionId).toBe(decrypterSpy.plainText)
  })

  test('Should throw if GetSessionByIdRepository throws', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    jest.spyOn(getSessionByIdRepositorySpy, 'getSessionById').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAccountBySessionDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetSessionByIdRepository return null', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session = null
    const account = await sut.show(mockShowAccountBySessionDTO())
    expect(account).toBeFalsy()
  })
})
