import { AccountRepositoryTypeORM } from './account-repository'
import { Connection } from 'typeorm'
import { mockCreateAccountDTO } from '@/data/test/auth'
import { closeConnection, truncateTables } from '@/infra/test/db/typeorm'
import { createTypeOrmConnection } from '@/infra/db/typeorm/connections'
import { AccountType } from '@/domain/models/auth'
import faker from 'faker'
import { mockCreateAccountModel, mockUpdateAccountDTO } from '@/infra/test/db/auth'

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
    await truncateTables(connection)
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

  describe('GetAccountByEmail Method', () => {
    test('Should return null if account not found', async () => {
      const { sut } = makeSut()
      const accountByEmail = await sut.getAccountByEmail(faker.internet.email())
      expect(accountByEmail).toBeFalsy()
    })

    test('Should return an account with correct email', async () => {
      const { sut } = makeSut()
      const createAccountModel = mockCreateAccountModel()
      await sut.create(createAccountModel)
      const accountByEmail = await sut.getAccountByEmail(createAccountModel.email)
      expect(accountByEmail.email).toBe(createAccountModel.email)
    })
  })

  describe('GetAccountById Method', () => {
    test('Should return null if account not found', async () => {
      const { sut } = makeSut()
      const accountByEmail = await sut.getAccountByEmail(faker.internet.email())
      expect(accountByEmail).toBeFalsy()
    })

    test('Should return an account with correct id', async () => {
      const { sut } = makeSut()
      const createdAccount = await sut.create(mockCreateAccountModel())
      const accountById = await sut.getAccountById(createdAccount.id)
      expect(accountById.id).toBe(createdAccount.id)
    })
  })

  describe('Update Method', () => {
    test('Should return null if account not found', async () => {
      const { sut } = makeSut()
      const updatedAccount = await sut.update({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        email_valided: true,
        password: faker.internet.password(),
        type: AccountType.student
      })
      expect(updatedAccount).toBeFalsy()
    })

    test('Should return an updated account if acccount is found', async () => {
      const { sut } = makeSut()
      const createdAccount = await sut.create(mockCreateAccountModel())
      const params = mockUpdateAccountDTO()
      params.id = createdAccount.id
      const updatedAccount = await sut.update(params)
      expect(updatedAccount.id).toBe(createdAccount.id)
      expect(updatedAccount.name).not.toBe(createdAccount.name)
      expect(updatedAccount.email).not.toBe(createdAccount.email)
      expect(updatedAccount.password).not.toBe(createdAccount.password)
      expect(updatedAccount.name).toBe(params.name)
      expect(updatedAccount.email).toBe(params.email)
      expect(updatedAccount.password).toBe(params.password)
    })
  })

  describe('List Method', () => {
    test('Should return null if account not found by name', async () => {
      const { sut } = makeSut()
      const accountByName = await sut.list({
        name: faker.name.findName(),
        email: null
      })
      expect(accountByName).toHaveLength(0)
    })

    test('Should return null if account not found by email', async () => {
      const { sut } = makeSut()
      const accountByName = await sut.list({
        email: faker.internet.email(),
        name: null
      })
      expect(accountByName).toHaveLength(0)
    })

    test('Should return an account with same name', async () => {
      const { sut } = makeSut()
      const createdAccount = await sut.create(mockCreateAccountModel())
      const accountByName = await sut.list({
        name: createdAccount.name,
        email: null
      })
      expect(accountByName).toHaveLength(1)
      expect(accountByName[0].name).toEqual(createdAccount.name)
    })

    test('Should return an account with same email', async () => {
      const { sut } = makeSut()
      const createdAccount = await sut.create(mockCreateAccountModel())
      const accountByEmail = await sut.list({
        email: createdAccount.email,
        name: null
      })
      expect(accountByEmail).toHaveLength(1)
      expect(accountByEmail[0].email).toEqual(createdAccount.email)
    })

    test('Should return an account with same email and same name', async () => {
      const { sut } = makeSut()
      const createdAccount = await sut.create(mockCreateAccountModel())
      const accountByEmail = await sut.list({
        email: createdAccount.email,
        name: createdAccount.name
      })
      expect(accountByEmail).toHaveLength(1)
      expect(accountByEmail[0].name).toEqual(createdAccount.name)
      expect(accountByEmail[0].email).toEqual(createdAccount.email)
    })
  })
})
