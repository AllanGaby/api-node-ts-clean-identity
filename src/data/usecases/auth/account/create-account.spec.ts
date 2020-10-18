import { DbCreateAccount } from './create-account'
import { GetAccountByEmailRepositorySpy, makeAddAccountDTO } from '@/data/test/auth'

interface sutTypes {
  sut: DbCreateAccount
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  const sut = new DbCreateAccount(getAccountByEmailRepositorySpy)
  return {
    sut,
    getAccountByEmailRepositorySpy
  }
}

describe('DbCreateAccount', () => {
  test('Should call GetAccountByEmail with correct value', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(addAccountParams.email)
  })
})
