import { DbSetAccountAccessies } from './set-account-accessies'
import { GetAccountAccessiesByAccountIdRepositorySpy, mockAccountAccessiesModel, throwError } from '@/data/test'

interface sutTypes {
  sut: DbSetAccountAccessies
  getAccountAccessiesByAccountIdRepositorySpy: GetAccountAccessiesByAccountIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountAccessiesByAccountIdRepositorySpy = new GetAccountAccessiesByAccountIdRepositorySpy()
  const sut = new DbSetAccountAccessies(getAccountAccessiesByAccountIdRepositorySpy)
  return {
    sut,
    getAccountAccessiesByAccountIdRepositorySpy
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
})
