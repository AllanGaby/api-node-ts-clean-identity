import { DbShowAccount } from './show-account'
import { mockShowAccountFilter, ShowAccountRepositorySpy } from '@/data/test'

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
})
