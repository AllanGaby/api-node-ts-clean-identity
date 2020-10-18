import { DbCreateAccount } from './create-account'
import { HasherSpy } from '@/data/test/mock-criptography'
import { GetAccountByEmailRepositorySpy, makeAddAccountDTO, mockAccountModel } from '@/data/test/auth'

interface sutTypes {
  sut: DbCreateAccount
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  hasherSpy: HasherSpy
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const sut = new DbCreateAccount(getAccountByEmailRepositorySpy, hasherSpy)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    hasherSpy
  }
}

describe('DbCreateAccount', () => {
  test('Should call GetAccountByEmail with correct value', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(addAccountParams.email)
  })

  test('Should return null if GetAccountByEmail return an Account', async () => {
    const { sut, getAccountByEmailRepositorySpy, hasherSpy } = makeSut()
    const createHashSpy = jest.spyOn(hasherSpy, 'createHash')
    getAccountByEmailRepositorySpy.account = mockAccountModel()
    const account = await sut.add(makeAddAccountDTO())
    expect(account).toBeFalsy()
    expect(createHashSpy).not.toBeCalled()
  })

  test('Should call Hasher with correct value', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(hasherSpy.payload).toBe(addAccountParams.password)
  })
})
