import { MemorySessionRepository } from './session'
import { mockCreateSessionModel } from '@/infra/test/db/memory/auth'

interface sutType {
  sut: MemorySessionRepository
}

const makeSut = (): sutType => {
  const sut = new MemorySessionRepository()
  return {
    sut
  }
}

describe('MemorySessionRepository Create Method', () => {
  test('Should return an new session with correct values', async () => {
    const { sut } = makeSut()
    const createSessionModel = mockCreateSessionModel()
    const createdSession = await sut.create(createSessionModel)
    expect(createdSession.id).toBeTruthy()
    expect(createdSession.experied_at).toBe(createSessionModel.experied_at)
    expect(createdSession.accountId).toBe(createSessionModel.accountId)
    expect(createdSession.type).toBe(createSessionModel.type)
  })
})
