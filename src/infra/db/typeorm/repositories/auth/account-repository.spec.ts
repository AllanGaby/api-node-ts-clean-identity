import { AccountRepositoryTypeORM } from './account-repository'
import { Connection } from 'typeorm'
import { mockCreateAccountDTO } from '@/data/test/auth'
import { closeConnection, truncateTables } from '@/infra/test/db/typeorm'
import { createTypeOrmConnection } from '@/infra/db/typeorm/connections'
import { AccountType } from '@/domain/models/auth'

let connection: Connection

interface sutType {
  sut: AccountRepositoryTypeORM
}

const makeSut = (): sutType => {
  const sut = new AccountRepositoryTypeORM()
  return {
    sut
  }
}

describe('AccountRepositoryTypeORM', () => {
  beforeAll(async () => {
    connection = await createTypeOrmConnection()
  })

  beforeEach(async () => {
    await truncateTables(connection)
  })

  afterAll(async () => {
    await closeConnection(connection)
  })

  describe('Create Method', () => {
    test('Should return account with correct values', async () => {
      const { sut } = makeSut()
      const params = mockCreateAccountDTO()
      const createdAccount = await sut.create(params)
      expect(createdAccount.id).toBeTruthy()
      expect(createdAccount.name).toBe(params.name)
      expect(createdAccount.email).toBe(params.email)
      expect(createdAccount.password).toBe(params.password)
      expect(createdAccount.email_valided).toBeFalsy()
      expect(createdAccount.type).toBe(AccountType.student)
      expect(createdAccount.created_at).toBeTruthy()
      expect(createdAccount.updated_at).toBeTruthy()
    })
  })
})
