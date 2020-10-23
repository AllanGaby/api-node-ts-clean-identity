import { DbSetAccountAccessies } from './set-account-accessies'
import { GetAccountAccessiesByAccountIdRepositorySpy, mockAccountAccessiesModel, throwError, CreateAccountAccessiesRepositorySpy } from '@/data/test'

interface sutTypes {
  sut: DbSetAccountAccessies
  getAccountAccessiesByAccountIdRepositorySpy: GetAccountAccessiesByAccountIdRepositorySpy
  createAccountAccessiesRepositorySpy: CreateAccountAccessiesRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountAccessiesByAccountIdRepositorySpy = new GetAccountAccessiesByAccountIdRepositorySpy()
  const createAccountAccessiesRepositorySpy = new CreateAccountAccessiesRepositorySpy()
  const sut = new DbSetAccountAccessies(getAccountAccessiesByAccountIdRepositorySpy, createAccountAccessiesRepositorySpy)
  return {
    sut,
    getAccountAccessiesByAccountIdRepositorySpy,
    createAccountAccessiesRepositorySpy
  }
}

describe('DbSetAccountAccessies', () => {
  test('Should call GetAccountAccessiesByAccountIdRepository with correct value', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy } = makeSut()
    const accountAccessies = mockAccountAccessiesModel()
    await sut.set(accountAccessies)
    expect(getAccountAccessiesByAccountIdRepositorySpy.accountId).toBe(accountAccessies.accountId)
  })

  test('Should throw if GetAccountAccessiesByAccountIdRepository throws', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountAccessiesByAccountIdRepositorySpy, 'getAccountAccessiesByAccountId').mockImplementationOnce(throwError)
    const promise = sut.set(mockAccountAccessiesModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateAccountAccessiesByAccountIdRepository with correct value', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy, createAccountAccessiesRepositorySpy } = makeSut()
    getAccountAccessiesByAccountIdRepositorySpy.accountAccessies = null
    const accountAccessies = mockAccountAccessiesModel()
    await sut.set(accountAccessies)
    expect(createAccountAccessiesRepositorySpy.accountAccessies).toEqual(accountAccessies)
  })
})
