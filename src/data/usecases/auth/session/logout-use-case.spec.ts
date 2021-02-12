import { DbLogoutUseCase } from './logout-use-case'
import { GetSessionByIdRepositorySpy, DeleteSessionByIdRepositorySpy, mockLogoutDTO, mockSessionModel } from '@/data/test/auth/session'
import { CacheRecoverSpy, CacheRemoveSpy, throwError } from '@/data/test'

import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbLogoutUseCase
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
  deleteSessionByIdRepositorySpy: DeleteSessionByIdRepositorySpy
  cacheRecoverSpy: CacheRecoverSpy
  cacheRemoveSpy: CacheRemoveSpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const deleteSessionByIdRepositorySpy = new DeleteSessionByIdRepositorySpy()
  const cacheRecoverSpy = new CacheRecoverSpy()
  const cacheRemoveSpy = new CacheRemoveSpy()
  const sut = new DbLogoutUseCase(getSessionByIdRepositorySpy, deleteSessionByIdRepositorySpy, cacheRecoverSpy, cacheRemoveSpy)
  return {
    sut,
    getSessionByIdRepositorySpy,
    deleteSessionByIdRepositorySpy,
    cacheRecoverSpy,
    cacheRemoveSpy
  }
}

describe('DbLogoutUseCase', () => {
  test('Should call CacheRecover with correct value', async () => {
    const { sut, cacheRecoverSpy } = makeSut()
    const request = mockLogoutDTO()
    await sut.logout(request)
    expect(cacheRecoverSpy.key).toEqual(`session-authentication:${request.sessionId}`)
  })

  test('Should throw if CacheRecover throws', async () => {
    const { sut, cacheRecoverSpy } = makeSut()
    jest.spyOn(cacheRecoverSpy, 'recover').mockImplementationOnce(throwError)
    const promise = sut.logout(mockLogoutDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should not call GetSessionByIdRepository if CacheRecover return a session', async () => {
    const { sut, cacheRecoverSpy, getSessionByIdRepositorySpy } = makeSut()
    const request = mockLogoutDTO()
    const getSessionByIdSpy = jest.spyOn(getSessionByIdRepositorySpy, 'getSessionById')
    cacheRecoverSpy.result = mockSessionModel()
    await sut.logout(request)
    expect(getSessionByIdSpy).not.toBeCalled()
  })

  test('Should call GetSessionByIdRepository with correct value', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const request = mockLogoutDTO()
    await sut.logout(request)
    expect(getSessionByIdRepositorySpy.sessionId).toEqual(request.sessionId)
  })

  test('Should throw if GetSessionByIdRepository throws', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    jest.spyOn(getSessionByIdRepositorySpy, 'getSessionById').mockImplementationOnce(throwError)
    const promise = sut.logout(mockLogoutDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return InvalidCredentialsError if session not found', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session = null
    const promise = sut.logout(mockLogoutDTO())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should return InvalidCredentialsError if session id is undefined', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session = null
    const request = mockLogoutDTO()
    request.sessionId = undefined
    const promise = sut.logout(request)
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should call DeleteSessionByIdRepository with correct value', async () => {
    const { sut, getSessionByIdRepositorySpy, deleteSessionByIdRepositorySpy } = makeSut()
    await sut.logout(mockLogoutDTO())
    expect(deleteSessionByIdRepositorySpy.sessionId).toEqual(getSessionByIdRepositorySpy.session.id)
  })

  test('Should throw if DeleteSessionRepository throws', async () => {
    const { sut, deleteSessionByIdRepositorySpy } = makeSut()
    jest.spyOn(deleteSessionByIdRepositorySpy, 'deleteById').mockImplementationOnce(throwError)
    const promise = sut.logout(mockLogoutDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CacheRemove with correct value', async () => {
    const { sut, cacheRecoverSpy, cacheRemoveSpy } = makeSut()
    const request = mockLogoutDTO()
    await sut.logout(request)
    expect(cacheRemoveSpy.key).toEqual(cacheRecoverSpy.key)
  })

  test('Should throw if CacheRemove throws', async () => {
    const { sut, cacheRemoveSpy } = makeSut()
    jest.spyOn(cacheRemoveSpy, 'remove').mockImplementationOnce(throwError)
    const promise = sut.logout(mockLogoutDTO())
    await expect(promise).rejects.toThrow()
  })
})
