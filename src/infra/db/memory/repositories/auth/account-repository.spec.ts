import { MemoryAccountRepository } from './account-repository'
import { mockCreateAccountModel } from '@/infra/test/db/auth'
import faker from 'faker'
import { AccountType } from '@/domain/models/auth'

interface sutTypes {
  sut: MemoryAccountRepository
}

const makeSut = (): sutTypes => {
  const sut = MemoryAccountRepository.getInstance()
  return {
    sut
  }
}

describe('MemoryAccountRepository', () => {
  describe('Create Method', () => {
    test('Should return an new account with correct values', async () => {
      const { sut } = makeSut()
      const createAccountModel = mockCreateAccountModel()
      const createdAccount = await sut.create(createAccountModel)
      expect(createdAccount.id).toBeTruthy()
      expect(createdAccount.name).toBe(createAccountModel.name)
      expect(createdAccount.email).toBe(createAccountModel.email)
      expect(createdAccount.password).toBe(createAccountModel.password)
      expect(createdAccount.type).toBe(AccountType.student)
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
      const createAccountModel = mockCreateAccountModel()
      const createdAccount = await sut.create(mockCreateAccountModel())
      const updatedAccount = await sut.update({
        id: createdAccount.id,
        name: createAccountModel.name,
        email: createAccountModel.email,
        password: createAccountModel.password,
        email_valided: createdAccount.email_valided,
        type: createdAccount.type
      })
      expect(updatedAccount.id).toBe(createdAccount.id)
      expect(updatedAccount.name).not.toBe(createdAccount.name)
      expect(updatedAccount.email).not.toBe(createdAccount.email)
      expect(updatedAccount.password).not.toBe(createdAccount.password)
      expect(updatedAccount.name).toBe(createAccountModel.name)
      expect(updatedAccount.email).toBe(createAccountModel.email)
      expect(updatedAccount.password).toBe(createAccountModel.password)
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

    test('Should return an account with same name', async () => {
      const { sut } = makeSut()
      const createdAccount = await sut.create(mockCreateAccountModel())
      const accountByName = await sut.list({
        name: createdAccount.name,
        email: null
      })
      expect(accountByName).toHaveLength(1)
      expect(accountByName[0]).toEqual(createdAccount)
    })

    test('Should return null if account not found by email', async () => {
      const { sut } = makeSut()
      const accountByName = await sut.list({
        email: faker.internet.email(),
        name: null
      })
      expect(accountByName).toHaveLength(0)
    })

    test('Should return an account with same email', async () => {
      const { sut } = makeSut()
      const createdAccount = await sut.create(mockCreateAccountModel())
      const accountByEmail = await sut.list({
        email: createdAccount.email,
        name: null
      })
      expect(accountByEmail).toHaveLength(1)
      expect(accountByEmail[0]).toEqual(createdAccount)
    })

    test('Should return an account with correct id', async () => {
      const { sut } = makeSut()
      const createdAccount = await sut.create(mockCreateAccountModel())
      const accountById = await sut.getAccountById(createdAccount.id)
      expect(accountById.id).toBe(createdAccount.id)
    })
  })
})
