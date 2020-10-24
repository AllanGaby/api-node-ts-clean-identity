import { DbShowAccountAccessies } from './show-account-accessies'
import { GetAccountAccessiesByAccountIdRepositorySpy, mockShowAccountAccessiesFilter, throwError } from '@/data/test'

interface sutTypes {
  sut: DbShowAccountAccessies
  getAccountAccessiesByAccountIdRepositorySpy: GetAccountAccessiesByAccountIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountAccessiesByAccountIdRepositorySpy = new GetAccountAccessiesByAccountIdRepositorySpy()
  const sut = new DbShowAccountAccessies(getAccountAccessiesByAccountIdRepositorySpy)
  return {
    sut,
    getAccountAccessiesByAccountIdRepositorySpy
  }
}

describe('DbShowAccountAccessies', () => {
  test('Should call getAccountAccessiesByAccountIdRepositorySpy with correct value', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy } = makeSut()
    const accountId = mockShowAccountAccessiesFilter()
    await sut.show(accountId)
    expect(getAccountAccessiesByAccountIdRepositorySpy.accountId).toBe(accountId.accountId)
  })

  test('Should throw if GetAccountAccessiesByAccountIdRepository throws', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountAccessiesByAccountIdRepositorySpy, 'getAccountAccessiesByAccountId').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAccountAccessiesFilter())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountAccessiesByAccountIdRepository return null', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy } = makeSut()
    getAccountAccessiesByAccountIdRepositorySpy.accountAccessies = null
    const accountAccessies = await sut.show(mockShowAccountAccessiesFilter())
    expect(accountAccessies).toBeFalsy()
  })
})
