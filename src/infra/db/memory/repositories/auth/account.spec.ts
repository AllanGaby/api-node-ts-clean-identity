import { mockCreateAccountModel, mockUpdateAccountModel } from '@/infra/test/db/mock-account'
import { MemoryAccountRepository } from './account'
import faker from 'faker'
import { CreateAccountModel } from '@/data/repositories/auth/account'
import { AccountModel } from '@/domain/models/auth'

interface sutTypes {
  sut: MemoryAccountRepository
  createParams: CreateAccountModel
}

const makeSut = (): sutTypes => {
  const createParams = mockCreateAccountModel()
  const sut = new MemoryAccountRepository()
  return {
    sut,
    createParams
  }
}

const checkCreatedAccountValues = (createdAccount: AccountModel, params: CreateAccountModel): void => {
  expect(createdAccount.id).toBeTruthy()
  expect(createdAccount.name).toBe(params.name)
  expect(createdAccount.email).toBe(params.email)
  expect(createdAccount.password).toBe(params.password)
  expect(createdAccount.email_valided).toBeFalsy()
  expect(createdAccount.accessProfileId).toBeFalsy()
  expect(createdAccount.created_at).toBeTruthy()
  expect(createdAccount.updated_at).toBeTruthy()
}

describe('MemoryAccountRepository Create Method', () => {
  test('Should return an account with correct values', async () => {
    const { sut, createParams } = makeSut()
    const createdAccount = await sut.create(createParams)
    checkCreatedAccountValues(createdAccount, createParams)
  })
})

describe('MemoryAccountRepository GetAccountByEmail Method', () => {
  test('Should return null if account not found', async () => {
    const { sut } = makeSut()
    const account = await sut.getAccountByEmail(faker.internet.email())
    expect(account).toBeFalsy()
  })

  test('Should return an account if account is found', async () => {
    const { sut, createParams } = makeSut()
    await sut.create(createParams)
    const account = await sut.getAccountByEmail(createParams.email)
    checkCreatedAccountValues(account, createParams)
  })
})

describe('MemoryAccountRepository GetAccountById Method', () => {
  test('Should return null if account not found', async () => {
    const { sut } = makeSut()
    const account = await sut.getAccountById(faker.random.uuid())
    expect(account).toBeFalsy()
  })

  test('Should return an account if account is found', async () => {
    const { sut, createParams } = makeSut()
    const createdAccount = await sut.create(createParams)
    const account = await sut.getAccountById(createdAccount.id)
    checkCreatedAccountValues(account, createParams)
  })
})

describe('MemoryAccountRepository Update Method', () => {
  test('Should return null if account not found', async () => {
    const { sut } = makeSut()
    const updateAccount = await sut.update(mockUpdateAccountModel())
    expect(updateAccount).toBeFalsy()
  })

  test('Should return an updated account if account if found', async () => {
    const { sut, createParams } = makeSut()
    const updateParams = mockUpdateAccountModel()
    const createdAccount = await sut.create(createParams)
    updateParams.id = createdAccount.id
    const updatedAccount = await sut.update(updateParams)
    expect(updatedAccount.id).toBe(updateParams.id)
    expect(updatedAccount.name).toBe(updateParams.name)
    expect(updatedAccount.email).toBe(updateParams.email)
    expect(updatedAccount.password).toBe(updateParams.password)
    expect(updatedAccount.email_valided).toBe(updateParams.email_valided)
    expect(updatedAccount.accessProfileId).toBe(updateParams.accessProfileId)
    expect(updatedAccount.created_at).toBe(createdAccount.created_at)
    expect(updatedAccount.updated_at).not.toBe(createdAccount.updated_at)
  })
})

describe('MemoryAccountRepository List Method', () => {
  test('Should return null if account not found', async () => {
    const { sut } = makeSut()
    const list = await sut.list({ name: faker.name.findName(), email: faker.internet.email() })
    expect(list).toHaveLength(0)
  })

  test('Should return an account if account is found by name', async () => {
    const { sut, createParams } = makeSut()
    const createdAccount = await sut.create(createParams)
    const list = await sut.list({ name: createParams.name, email: null })
    expect(list).toHaveLength(1)
    expect(list[0]).toEqual(createdAccount)
  })

  test('Should return an account if account is found by email', async () => {
    const { sut, createParams } = makeSut()
    const createdAccount = await sut.create(createParams)
    const list = await sut.list({ name: null, email: createdAccount.email })
    expect(list).toHaveLength(1)
    expect(list[0]).toEqual(createdAccount)
  })
})
