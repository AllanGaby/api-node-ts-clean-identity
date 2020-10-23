import { DbShowAccount } from './show-account'
import { mockShowAccountFilter, ShowAccountRepositorySpy, throwError } from '@/data/test'

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

  test('Should throw if ListAccountRepository throws', async () => {
    const { sut, showAccountRepositorySpy } = makeSut()
    jest.spyOn(showAccountRepositorySpy, 'show').mockImplementationOnce(throwError)
    const promise = sut.show(mockShowAccountFilter())
    await expect(promise).rejects.toThrow()
  })
})
