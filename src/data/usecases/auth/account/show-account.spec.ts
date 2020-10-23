import { DbShowAccount } from './show-account'
import { mockAccountModel, mockShowAccountFilter, ShowAccountRepositorySpy, throwError } from '@/data/test'

interface sutTypes {
  sut: DbShowAccount
  showAccountRepositorySpy: ShowAccountRepositorySpy
}

const makeSut = (): sutTypes => {
  const showAccountRepositorySpy = new ShowAccountRepositorySpy()
  const sut = new DbShowAccount(showAccountRepositorySpy)
  return {
    sut,
    showAccountRepositorySpy
  }
}

describe('DbShowAccount', () => {
  test('Should call ShowAccountRepository with correct value', async () => {
    const { sut, showAccountRepositorySpy } = makeSut()
    const showAccountFilter = mockShowAccountFilter()
    await sut.show(showAccountFilter)
    expect(showAccountRepositorySpy.filter).toEqual(showAccountFilter)
  })

  test('Should throw if ShowAccountRepository throws', async () => {
    const { sut, showAccountRepositorySpy } = makeSut()
    jest.spyOn(showAccountRepositorySpy, 'show').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAccountFilter())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if ShowAccountRepository return null', async () => {
    const { sut, showAccountRepositorySpy } = makeSut()
    showAccountRepositorySpy.account = null
    const account = await sut.show(mockShowAccountFilter())
    expect(account).toBeFalsy()
  })

  test('Should return an account if ShowAccountRepository return an account', async () => {
    const { sut, showAccountRepositorySpy } = makeSut()
    showAccountRepositorySpy.account = mockAccountModel()
    const account = await sut.show(mockShowAccountFilter())
    expect(account).toEqual(showAccountRepositorySpy.account)
  })
})
