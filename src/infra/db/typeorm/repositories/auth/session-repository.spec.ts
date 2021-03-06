import { mockCreateSessionModel, mockCreateAccountModel } from '@/infra/tests/db/auth'
import { closeConnection, truncateTables } from '@/infra/tests/db/typeorm'
import { Connection } from 'typeorm'
import { createTypeOrmConnection } from '@/infra/db/typeorm/connections'
import { Account, Session } from '@/infra/db/typeorm/models'
import { AccountRepositoryTypeORM, SessionRepositoryTypeORM } from './'
import faker from 'faker'

interface sutTypes {
  sut: SessionRepositoryTypeORM
}

const makeSut = (): sutTypes => {
  const sut = SessionRepositoryTypeORM.getInstance()
  return {
    sut
  }
}

let connection: Connection
let account: Account
let session: Session
let accountRepository: AccountRepositoryTypeORM

describe('MemorySessionRepository', () => {
  beforeAll(async () => {
    connection = await createTypeOrmConnection('localhost')
    accountRepository = AccountRepositoryTypeORM.getInstance()
  })

  beforeEach(async () => {
    await truncateTables(connection)
    account = await accountRepository.create(mockCreateAccountModel())
    const { sut } = makeSut()
    const createSessionModel = mockCreateSessionModel()
    createSessionModel.account_id = account.id
    session = await sut.create(createSessionModel)
  })

  afterAll(async () => {
    await truncateTables(connection)
    await closeConnection(connection)
  })

  describe('Create Method', () => {
    test('Should return an new session with correct values', async () => {
      const { sut } = makeSut()
      const createSessionModel = mockCreateSessionModel()
      createSessionModel.account_id = account.id
      const createdSession = await sut.create(createSessionModel)
      expect(createdSession.id).toBeTruthy()
      expect(createdSession.experied_at).toBe(createSessionModel.experied_at)
      expect(createdSession.account_id).toBe(createSessionModel.account_id)
      expect(createdSession.type).toBe(createSessionModel.type)
      expect(createdSession.account_id).toBe(account.id)
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
      const sessionById = await sut.getSessionById(session.id)
      expect(sessionById.id).toBe(session.id)
    })
  })

  describe('DeleteById Method', () => {
    test('Should return null if session not found to delete', async () => {
      const { sut } = makeSut()
      const sessionId = faker.random.uuid()
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
      const existsSession = await sut.getSessionById(session.id)
      expect(existsSession).toEqual(session)
      expect(existsSession.deleted_at).toBeFalsy()
      await sut.deleteById(existsSession.id)
      const deletedSession = await sut.getSessionById(session.id)
      expect(deletedSession.deleted_at).toBeTruthy()
    })
  })

  describe('Actions By Account Id', () => {
    beforeEach(async () => {
      const { sut } = makeSut()
      const createdSession = mockCreateSessionModel()
      createdSession.account_id = account.id
      await sut.create(createdSession)
      await sut.create(createdSession)
      await sut.create(createdSession)
    })

    describe('GetSessionByAccountId Method', () => {
      test('Should return a list with 4 sessions', async () => {
        const { sut } = makeSut()
        const list = await sut.getSessionByAccountId(session.account_id)
        expect(list).toHaveLength(4)
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
        const accountId = session.account_id
        const list = await sut.getSessionByAccountId(accountId)
        expect(list).toHaveLength(4)
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
