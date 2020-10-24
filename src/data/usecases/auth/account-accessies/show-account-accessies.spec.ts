import { DbShowAccountAccessies } from './show-account-accessies'
import { GetAccountAccessiesByAccountIdRepositorySpy, mockShowAccountAccessiesFilter } from '@/data/test'

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
})
