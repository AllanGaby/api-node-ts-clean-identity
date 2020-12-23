import { mockCreateSessionModel, mockCreateAccountModel } from '@/infra/test/db/auth'
import { closeConnection, truncateTables } from '@/infra/test/db/typeorm'
import { Connection } from 'typeorm'
import { createTypeOrmConnection } from '@/infra/db/typeorm/connections'
import { Account } from '@/infra/db/typeorm/models'
import { AccountRepositoryTypeORM, SessionRepositoryTypeORM } from './'

interface sutTypes {
  sut: SessionRepositoryTypeORM
}

const makeSut = (): sutTypes => {
  const sut = new SessionRepositoryTypeORM()
  return {
    sut
  }
}

let connection: Connection
let account: Account
let accountRepository: AccountRepositoryTypeORM

describe('MemorySessionRepository', () => {
  beforeAll(async () => {
    connection = await createTypeOrmConnection()
    accountRepository = new AccountRepositoryTypeORM()
  })

  beforeEach(async () => {
    await truncateTables(connection)
    account = await accountRepository.create(mockCreateAccountModel())
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
})
