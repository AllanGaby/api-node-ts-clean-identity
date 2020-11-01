import { mockCreateAccountModel } from '@/infra/test/db/mock-account'
import { MemoryAccountModel } from '@/infra/db/memory/models/auth'
import { MemoryAccountRepository } from './account'
import faker from 'faker'
import { CreateAccountModel } from '@/data/repositories/auth/account'

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

const checkCreatedAccountValues = (createdAccount: MemoryAccountModel, params: CreateAccountModel): void => {
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
