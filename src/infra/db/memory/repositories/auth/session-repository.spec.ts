import { MemorySessionRepository } from './session-repository'
import { mockCreateSessionModel } from '@/infra/test/db/memory/auth'
import faker from 'faker'
import { mockSessionModel } from '@/data/test'

interface sutType {
  sut: MemorySessionRepository
}

const makeSut = (): sutType => {
  const sut = MemorySessionRepository.getInstance()
  return {
    sut
  }
}

describe('MemorySessionRepository', () => {
  describe('Create Method', () => {
    test('Should return an new session with correct values', async () => {
      const { sut } = makeSut()
      const createSessionModel = mockCreateSessionModel()
      const createdSession = await sut.create(createSessionModel)
      expect(createdSession.id).toBeTruthy()
      expect(createdSession.experied_at).toBe(createSessionModel.experied_at)
      expect(createdSession.account_id).toBe(createSessionModel.account_id)
      expect(createdSession.type).toBe(createSessionModel.type)
    })
  })

  describe('GetSessionById Method', () => {
    test('Should return null if session not found', async () => {
      const { sut } = makeSut()
      const sessionById = await sut.getSessionById(faker.random.uuid())
      expect(sessionById).toBeFalsy()
    })

    test('Should return an session with correct id', async () => {
      const { sut } = makeSut()
      const createdSession = await sut.create(mockCreateSessionModel())
      const sessionById = await sut.getSessionById(createdSession.id)
      expect(sessionById.id).toBe(createdSession.id)
    })
  })

  describe('GetSessionById Method', () => {
    test('Should return null if session not found', async () => {
      const { sut } = makeSut()
      const session = mockSessionModel()
      const beforeSession = await sut.getSessionById(session.id)
      expect(beforeSession).toBeFalsy()
      await sut.delete(beforeSession)
      const afterSession = await sut.getSessionById(session.id)
      expect(afterSession).toBeFalsy()
    })

    test('Should change session list if session found', async () => {
      const { sut } = makeSut()
      const createdSession = await sut.create(mockCreateSessionModel())
      const beforeSession = await sut.getSessionById(createdSession.id)
      expect(beforeSession).toEqual(beforeSession)
      await sut.delete(beforeSession)
      const afterSession = await sut.getSessionById(createdSession.id)
      expect(afterSession).toBeFalsy()
    })
  })
})
