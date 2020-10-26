import { DbShowAccount } from './show-account'
import { mockAccountModel, GetAccountByIdRepositorySpy, mockShowAccountFilter, throwError } from '@/data/test'

interface sutTypes {
  sut: DbShowAccount
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const sut = new DbShowAccount(getAccountByIdRepositorySpy)
  return {
    sut,
    getAccountByIdRepositorySpy
  }
}

describe('DbShowAccount', () => {
  test('Should call GetAccountByIdRepository with correct value', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    const showAccountFilter = mockShowAccountFilter()
    await sut.show(showAccountFilter)
    expect(getAccountByIdRepositorySpy.accountId).toEqual(showAccountFilter.accountId)
  })

  test('Should throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAccountFilter())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByIdRepository return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const account = await sut.show(mockShowAccountFilter())
    expect(account).toBeFalsy()
  })

  test('Should return an account if GetAccountByIdRepository return an account', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = mockAccountModel()
    const account = await sut.show(mockShowAccountFilter())
    expect(account).toEqual(getAccountByIdRepositorySpy.account)
  })
})
