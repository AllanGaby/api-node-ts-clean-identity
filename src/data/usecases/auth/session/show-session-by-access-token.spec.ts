import { DbShowSessionByAccessToken } from './show-session-by-access-token'
import { DecrypterSpy, mockShowSessionByAccessTokenDTO, throwError, GetSessionByIdRepositorySpy } from '@/data/test'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbShowSessionByAccessToken
  decrypterSpy: DecrypterSpy
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const sut = new DbShowSessionByAccessToken(decrypterSpy, getSessionByIdRepositorySpy)
  return {
    sut,
    decrypterSpy,
    getSessionByIdRepositorySpy
  }
}

describe('DbShowSessionByAccessToken', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    const showAccountBySession = mockShowSessionByAccessTokenDTO()
    await sut.show(showAccountBySession)
    expect(decrypterSpy.encryptedText).toBe(showAccountBySession.accessToken)
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowSessionByAccessTokenDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if Decrypter return null', async () => {
    const { sut, decrypterSpy, getSessionByIdRepositorySpy } = makeSut()
    const getSessionByIdSpy = jest.spyOn(getSessionByIdRepositorySpy, 'getSessionById')
    decrypterSpy.plainText = null
    const promise = sut.show(mockShowSessionByAccessTokenDTO())
    await expect(promise).rejects.toThrow()
    expect(getSessionByIdSpy).not.toBeCalled()
  })

  test('Should call GetSessionByIdRepository with correct value', async () => {
    const { sut, decrypterSpy, getSessionByIdRepositorySpy } = makeSut()
    await sut.show(mockShowSessionByAccessTokenDTO())
    expect(getSessionByIdRepositorySpy.sessionId).toBe(decrypterSpy.plainText)
  })

  test('Should throw if GetSessionByIdRepository throws', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    jest.spyOn(getSessionByIdRepositorySpy, 'getSessionById').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowSessionByAccessTokenDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return InvalidCredentialsError if GetSessionByIdRepository return null', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session = null
    const promise = sut.show(mockShowSessionByAccessTokenDTO())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should return a Session if GetSessionByIdRepository return correct session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const session = await sut.show(mockShowSessionByAccessTokenDTO())
    expect(session).toEqual(getSessionByIdRepositorySpy.session)
  })
})
