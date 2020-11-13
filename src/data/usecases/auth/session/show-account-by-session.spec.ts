import { DbShowAccountBySession } from './show-account-by-session'
import { DecrypterSpy, mockShowAccountBySessionDTO, throwError, GetSessionByIdRepositorySpy, GetAccountByIdRepositorySpy } from '@/data/test'

interface sutTypes {
  sut: DbShowAccountBySession
  decrypterSpy: DecrypterSpy
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const sut = new DbShowAccountBySession(decrypterSpy, getSessionByIdRepositorySpy, getAccountByIdRepositorySpy)
  return {
    sut,
    decrypterSpy,
    getSessionByIdRepositorySpy,
    getAccountByIdRepositorySpy
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
    const { sut, decrypterSpy, getSessionByIdRepositorySpy } = makeSut()
    const getSessionByIdSpy = jest.spyOn(getSessionByIdRepositorySpy, 'getSessionById')
    decrypterSpy.plainText = null
    const promise = sut.show(mockShowAccountBySessionDTO())
    await expect(promise).rejects.toThrow()
    expect(getSessionByIdSpy).not.toBeCalled()
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
    const promise = sut.show(mockShowAccountBySessionDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call GetAccountByIdRepository with correct value', async () => {
    const { sut, getSessionByIdRepositorySpy, getAccountByIdRepositorySpy } = makeSut()
    await sut.show(mockShowAccountBySessionDTO())
    expect(getAccountByIdRepositorySpy.accountId).toBe(getSessionByIdRepositorySpy.session.account_id)
  })

  test('Should throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAccountBySessionDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByIdRepository return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const account = await sut.show(mockShowAccountBySessionDTO())
    expect(account).toBeFalsy()
  })
})
