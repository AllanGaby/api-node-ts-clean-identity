import { DbRecoverPassword } from './recover-password'
import { GetSessionByIdRepositorySpy, mockRecoverPasswordDTO } from '@/data/test'

interface sutTypes {
  sut: DbRecoverPassword
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const sut = new DbRecoverPassword(getSessionByIdRepositorySpy)
  return {
    sut,
    getSessionByIdRepositorySpy
  }
}

describe('DbRecoverPassword', () => {
  test('Should call GetSessionByIdRepository with correct value', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const recoverPasswordDTO = mockRecoverPasswordDTO()
    await sut.recover(recoverPasswordDTO)
    expect(getSessionByIdRepositorySpy.sessionId).toBe(recoverPasswordDTO.sessionId)
  })
})
