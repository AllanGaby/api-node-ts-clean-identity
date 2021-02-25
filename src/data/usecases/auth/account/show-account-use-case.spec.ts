import { DbShowAccountUseCase } from './show-account-use-case'
import { mockAccountModel, GetAccountByIdRepositorySpy, mockShowAccountDTO, throwError } from '@/data/tests'

interface sutTypes {
  sut: DbShowAccountUseCase
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const sut = new DbShowAccountUseCase(getAccountByIdRepositorySpy)
  return {
    sut,
    getAccountByIdRepositorySpy
  }
}

describe('DbShowAccountUseCase', () => {
  test('Should call GetAccountByIdRepository with correct value', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    const showAccountFilter = mockShowAccountDTO()
    await sut.show(showAccountFilter)
    expect(getAccountByIdRepositorySpy.accountId).toEqual(showAccountFilter.accountId)
  })

  test('Should throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByIdRepository return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const account = await sut.show(mockShowAccountDTO())
    expect(account).toBeFalsy()
  })

  test('Should return an account if GetAccountByIdRepository return an account', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = mockAccountModel()
    const account = await sut.show(mockShowAccountDTO())
    expect(account).toEqual(getAccountByIdRepositorySpy.account)
  })
})
