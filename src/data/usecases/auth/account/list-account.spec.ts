import { DbListAccount } from './list-account'
import { ListAccountRepositorySpy, mockListAccountFilter } from '@/data/test'

interface sutTypes {
  sut: DbListAccount
  listAccountRepositorySpy: ListAccountRepositorySpy
}

const makeSut = (): sutTypes => {
  const listAccountRepositorySpy = new ListAccountRepositorySpy()
  const sut = new DbListAccount(listAccountRepositorySpy)
  return {
    sut,
    listAccountRepositorySpy
  }
}

describe('DbListAccount', () => {
  test('Should call ListAccountRepository with correct value', async () => {
    const { sut, listAccountRepositorySpy } = makeSut()
    const filterAccount = mockListAccountFilter()
    await sut.list(filterAccount)
    expect(listAccountRepositorySpy.filter).toEqual(filterAccount)
  })
})
