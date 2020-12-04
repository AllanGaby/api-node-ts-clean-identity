import { DbLogout } from './logout'
import { GetSessionByIdRepositorySpy, DeleteSessionRepositorySpy, mockLogoutDTO } from '@/data/test/auth/session'
import { throwError } from '@/data/test'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbLogout
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
  deleteSessionRepositorySpy: DeleteSessionRepositorySpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const deleteSessionRepositorySpy = new DeleteSessionRepositorySpy()
  const sut = new DbLogout(getSessionByIdRepositorySpy, deleteSessionRepositorySpy)
  return {
    sut,
    getSessionByIdRepositorySpy,
    deleteSessionRepositorySpy
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

  test('Should call DeleteSessionRepository with correct value', async () => {
    const { sut, getSessionByIdRepositorySpy, deleteSessionRepositorySpy } = makeSut()
    await sut.logout(mockLogoutDTO())
    expect(deleteSessionRepositorySpy.session).toEqual(getSessionByIdRepositorySpy.session)
  })
})
