import { DbLogout } from './logout'
import { GetSessionByIdRepositorySpy, mockLogoutDTO } from '@/data/test/auth/session'
import { throwError } from '@/data/test'

interface sutTypes {
  sut: DbLogout
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const sut = new DbLogout(getSessionByIdRepositorySpy)
  return {
    sut,
    getSessionByIdRepositorySpy
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
})
