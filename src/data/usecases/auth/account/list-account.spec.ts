import { DbListAccount } from './list-account'
import { ListAccountRepositorySpy, mockListAccountFilter, throwError } from '@/data/test'

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

  test('Should throw if ListAccountRepository throws', async () => {
    const { sut, listAccountRepositorySpy } = makeSut()
    jest.spyOn(listAccountRepositorySpy, 'list').mockImplementationOnce(throwError)
    const promise = sut.list(mockListAccountFilter())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if ListAccountRepository return null', async () => {
    const { sut, listAccountRepositorySpy } = makeSut()
    listAccountRepositorySpy.listAccount = null
    const accountList = await sut.list(mockListAccountFilter())
    expect(accountList).toBeFalsy()
  })
})
