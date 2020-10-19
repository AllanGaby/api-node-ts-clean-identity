import { DbActiveAccount } from './active-account'
import { GetSessionByIdRepositorySpy } from '@/data/test/auth/mock-session-repository'
import { mockActiveAccountDTO } from '@/data/test/auth'

interface sutTypes {
  sut: DbActiveAccount
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const sut = new DbActiveAccount(getSessionByIdRepositorySpy)
  return {
    sut,
    getSessionByIdRepositorySpy
  }
}

describe('DbActiveAccount', () => {
  test('Should call GetSessionByIdRepository with correct values', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const activeAccountDTO = mockActiveAccountDTO()
    await sut.active(activeAccountDTO)
    expect(getSessionByIdRepositorySpy.sessionId).toBe(activeAccountDTO.sessionId)
  })
})
