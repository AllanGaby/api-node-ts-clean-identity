import { DbAuthenticationAccount } from './authentication-account'
import { mockAuthenticationAccountDTO } from '@/data/test/auth'
import { GetAccountByEmailRepositorySpy } from '@/data/test/auth/mock-account-repository'

interface sutTypes {
  sut: DbAuthenticationAccount
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  const sut = new DbAuthenticationAccount(getAccountByEmailRepositorySpy)
  return {
    sut,
    getAccountByEmailRepositorySpy
  }
}

describe('DbAuthenticationAccount', () => {
  test('Should call GetAccountByEmailRepository with correct values', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const authenticationAccountDTO = mockAuthenticationAccountDTO()
    await sut.authenticate(authenticationAccountDTO)
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(authenticationAccountDTO.email)
  })
})
