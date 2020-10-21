import { DbAuthenticationAccount } from './authentication-account'
import { mockAuthenticationAccountDTO, throwError, HashComparerSpy, mockAccountModel, EncrypterSpy } from '@/data/test'

import { GetAccountByEmailRepositorySpy } from '@/data/test/auth/mock-account-repository'

interface sutTypes {
  sut: DbAuthenticationAccount
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  getAccountByEmailRepositorySpy.account = mockAccountModel()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const sut = new DbAuthenticationAccount(getAccountByEmailRepositorySpy, hashComparerSpy, encrypterSpy)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy
  }
}

describe('DbAuthenticationAccount', () => {
  test('Should call GetAccountByEmailRepository with correct values', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const authenticationAccountDTO = mockAuthenticationAccountDTO()
    await sut.authenticate(authenticationAccountDTO)
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(authenticationAccountDTO.email)
  })

  test('Should throw if GetSessionByIdRepository throws', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(getAccountByEmailRepositorySpy, 'getAccountByEmail').mockImplementationOnce(throwError)
    const promise = sut.authenticate(mockAuthenticationAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetSessionByIdRepository return null', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    getAccountByEmailRepositorySpy.account = null
    const token = await sut.authenticate(mockAuthenticationAccountDTO())
    expect(token).toBeFalsy()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, getAccountByEmailRepositorySpy } = makeSut()
    const authenticationAccountDTO = mockAuthenticationAccountDTO()
    await sut.authenticate(authenticationAccountDTO)
    expect(hashComparerSpy.compareParams).toEqual({
      payload: authenticationAccountDTO.password,
      hashedText: getAccountByEmailRepositorySpy.account.password
    })
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.authenticate(mockAuthenticationAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValidHash = false
    const token = await sut.authenticate(mockAuthenticationAccountDTO())
    expect(token).toBeFalsy()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterSpy, getAccountByEmailRepositorySpy } = makeSut()
    const authenticationAccountDTO = mockAuthenticationAccountDTO()
    await sut.authenticate(authenticationAccountDTO)
    expect(encrypterSpy.plainText).toBe(getAccountByEmailRepositorySpy.account.id)
  })
})
