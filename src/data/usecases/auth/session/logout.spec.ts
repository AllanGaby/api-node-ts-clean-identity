import { DbLogout } from './logout'
import { GetSessionByIdRepositorySpy, DeleteSessionByIdRepositorySpy, mockLogoutDTO } from '@/data/test/auth/session'
import { throwError } from '@/data/test'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbLogout
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
  deleteSessionByIdRepositorySpy: DeleteSessionByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const deleteSessionByIdRepositorySpy = new DeleteSessionByIdRepositorySpy()
  const sut = new DbLogout(getSessionByIdRepositorySpy, deleteSessionByIdRepositorySpy)
  return {
    sut,
    getSessionByIdRepositorySpy,
    deleteSessionByIdRepositorySpy
  }
}

describe('DbLogout', () => {
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
})
