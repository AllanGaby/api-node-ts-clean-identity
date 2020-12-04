import { DbLogout } from './logout'
import { GetSessionByIdRepositorySpy, mockLogoutDTO } from '@/data/test/auth/session'

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
})
