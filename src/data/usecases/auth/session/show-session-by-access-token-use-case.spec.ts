import { DbShowSessionByAccessTokenUseCase } from './show-session-by-access-token-use-case'
import { DecrypterSpy, mockShowSessionByAccessTokenDTO, throwError, GetSessionByIdRepositorySpy, CacheCreateStub, CacheRecoverSpy, mockSessionModel } from '@/data/tests'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbShowSessionByAccessTokenUseCase
  decrypterSpy: DecrypterSpy
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
  cacheRecoverSpy: CacheRecoverSpy
  cacheCreateStub: CacheCreateStub
}

const makeSut = (): sutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const cacheRecoverSpy = new CacheRecoverSpy()
  const cacheCreateStub = new CacheCreateStub()
  const sut = new DbShowSessionByAccessTokenUseCase(decrypterSpy, getSessionByIdRepositorySpy, cacheRecoverSpy, cacheCreateStub)
  return {
    sut,
    decrypterSpy,
    getSessionByIdRepositorySpy,
    cacheRecoverSpy,
    cacheCreateStub
  }
}

describe('DbShowSessionByAccessTokenUseCase', () => {
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

  test('Should return InvalidCredentialsError if GetSessionByIdRepository return deleted session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session.deleted_at = new Date()
    const promise = sut.show(mockShowSessionByAccessTokenDTO())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should call CacheRecover with correct value', async () => {
    const { sut, cacheRecoverSpy, decrypterSpy } = makeSut()
    await sut.show(mockShowSessionByAccessTokenDTO())
    expect(cacheRecoverSpy.key).toEqual(`session-authentication:${decrypterSpy.plainText}`)
  })

  test('Should throw if CacheRecover throws', async () => {
    const { sut, cacheRecoverSpy } = makeSut()
    jest.spyOn(cacheRecoverSpy, 'recover').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowSessionByAccessTokenDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a session if CacheRecover return a session', async () => {
    const { sut, cacheRecoverSpy, getSessionByIdRepositorySpy } = makeSut()
    const sessionByIdSpy = jest.spyOn(getSessionByIdRepositorySpy, 'getSessionById')
    cacheRecoverSpy.result = mockSessionModel()
    const session = await sut.show(mockShowSessionByAccessTokenDTO())
    expect(sessionByIdSpy).not.toBeCalled()
    expect(session).toEqual(cacheRecoverSpy.result)
  })

  test('Should call CacheCreate with correct value', async () => {
    const { sut, cacheCreateStub, getSessionByIdRepositorySpy } = makeSut()
    await sut.show(mockShowSessionByAccessTokenDTO())
    expect(cacheCreateStub.params.key).toEqual(`session-authentication:${getSessionByIdRepositorySpy.session.id}`)
  })

  test('Should throw if CacheRecover throws', async () => {
    const { sut, cacheCreateStub } = makeSut()
    jest.spyOn(cacheCreateStub, 'create').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowSessionByAccessTokenDTO())
    await expect(promise).rejects.toThrow()
  })
})
