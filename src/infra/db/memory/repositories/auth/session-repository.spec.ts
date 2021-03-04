import { MemorySessionRepository } from './session-repository'
import { mockCreateSessionModel } from '@/infra/tests/db/auth'
import { mockSessionModel } from '@/data/tests'
import { SessionModel } from '@/domain/models/auth'
import faker from 'faker'

interface sutType {
  sut: MemorySessionRepository
}

const makeSut = (): sutType => {
  const sut = MemorySessionRepository.getInstance()
  return {
    sut
  }
}

let createdSession: SessionModel

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
    test('Should return null if session not found by session id', async () => {
      const { sut } = makeSut()
      const sessionById = await sut.getSessionById(faker.random.uuid())
      expect(sessionById).toBeFalsy()
    })

    test('Should return null if sessionId is undefined', async () => {
      const { sut } = makeSut()
      const sessionById = await sut.getSessionById(undefined)
      expect(sessionById).toBeFalsy()
    })

    test('Should return an session with correct id', async () => {
      const { sut } = makeSut()
      createdSession = await sut.create(mockCreateSessionModel())
      const sessionById = await sut.getSessionById(createdSession.id)
      expect(sessionById.id).toBe(createdSession.id)
    })
  })

  describe('DeleteById Method', () => {
    test('Should return null if session not found for deleting', async () => {
      const { sut } = makeSut()
      const session = mockSessionModel()
      const sessionId = session.id
      const beforeSession = await sut.getSessionById(sessionId)
      expect(beforeSession).toBeFalsy()
      await sut.deleteById(sessionId)
      const afterSession = await sut.getSessionById(sessionId)
      expect(afterSession).toBeFalsy()
    })

    test('Should return null if sessionId is undefined', async () => {
      const { sut } = makeSut()
      await sut.deleteById(undefined)
      const session = await sut.getSessionById(undefined)
      expect(session).toBeFalsy()
    })

    test('Should set deleted_at in session correct session', async () => {
      const { sut } = makeSut()
      const createdSession = await sut.create(mockCreateSessionModel())
      const existsSession = await sut.getSessionById(createdSession.id)
      expect(existsSession).toEqual(createdSession)
      expect(createdSession.deleted_at).toBeFalsy()
      await sut.deleteById(existsSession.id)
      const deletedSession = await sut.getSessionById(createdSession.id)
      expect(deletedSession.deleted_at).toBeTruthy()
    })
  })

  describe('Actions By Account Id', () => {
    beforeEach(async () => {
      const { sut } = makeSut()
      createdSession = mockSessionModel()
      await sut.create(createdSession)
      await sut.create(createdSession)
      await sut.create(createdSession)
    })

    describe('GetSessionByAccountId Method', () => {
      test('Should return a list with 3 sessions', async () => {
        const { sut } = makeSut()
        const list = await sut.getSessionByAccountId(createdSession.account_id)
        expect(list).toHaveLength(3)
      })

      test('Should return null if accountId is undefined', async () => {
        const { sut } = makeSut()
        const list = await sut.getSessionByAccountId(undefined)
        expect(list).toEqual([])
      })

      test('Should return null if session not found', async () => {
        const { sut } = makeSut()
        const list = await sut.getSessionByAccountId(faker.random.uuid())
        expect(list).toEqual([])
      })
    })

    describe('DeleteSessionByAccountId Method', () => {
      test('Should delete correct sessions', async () => {
        const { sut } = makeSut()
        const accountId = createdSession.account_id
        const list = await sut.getSessionByAccountId(accountId)
        expect(list).toHaveLength(3)
        list.map(session => {
          expect(session.deleted_at).toBeFalsy()
        })
        await sut.deleteByAccountId(accountId)
        const beforeList = await sut.getSessionByAccountId(accountId)
        beforeList.map(session => {
          expect(session.deleted_at).toBeTruthy()
        })
      })

      test('Should return null if accountId is undefined', async () => {
        const { sut } = makeSut()
        const accountId = undefined
        const list = await sut.getSessionByAccountId(accountId)
        expect(list).toEqual([])
        await sut.deleteByAccountId(accountId)
        const beforeList = await sut.getSessionByAccountId(accountId)
        expect(beforeList).toEqual([])
      })

      test('Should return null if session not found', async () => {
        const { sut } = makeSut()
        const accountId = faker.random.uuid()
        const list = await sut.getSessionByAccountId(accountId)
        expect(list).toEqual([])
        await sut.deleteByAccountId(accountId)
        const beforeList = await sut.getSessionByAccountId(accountId)
        expect(beforeList).toEqual([])
      })
    })
  })
})
