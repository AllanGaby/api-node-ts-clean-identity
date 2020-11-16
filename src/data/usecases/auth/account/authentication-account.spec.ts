import { DbAuthenticationAccount } from './authentication-account'
import { mockAuthenticationAccountDTO, throwError, HashComparerSpy, mockAccountModel, EncrypterSpy, CreateSessionRepositorySpy } from '@/data/test'
import { GetAccountByEmailRepositorySpy } from '@/data/test/auth/account/mock-account-repository'
import { SessionType } from '@/domain/models/auth'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbAuthenticationAccount
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  createSessionRepositorySpy: CreateSessionRepositorySpy
  encrypterSpy: EncrypterSpy
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  getAccountByEmailRepositorySpy.account = mockAccountModel()
  const hashComparerSpy = new HashComparerSpy()
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const encrypterSpy = new EncrypterSpy()
  const sut = new DbAuthenticationAccount(getAccountByEmailRepositorySpy, hashComparerSpy, createSessionRepositorySpy, encrypterSpy)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    hashComparerSpy,
    createSessionRepositorySpy,
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

  test('Should throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(getAccountByEmailRepositorySpy, 'getAccountByEmail').mockImplementationOnce(throwError)
    const promise = sut.authenticate(mockAuthenticationAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetSessionByIdRepository return null', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    getAccountByEmailRepositorySpy.account = null
    const promise = sut.authenticate(mockAuthenticationAccountDTO())
    await expect(promise).rejects.toThrow()
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

  test('Should return InvalidaCredentials if HashComparer return false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValidHash = false
    const promise = sut.authenticate(mockAuthenticationAccountDTO())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should call CreateSessionRepository with correct value', async () => {
    const { sut, createSessionRepositorySpy, getAccountByEmailRepositorySpy } = makeSut()
    const authenticationAccountDTO = mockAuthenticationAccountDTO()
    await sut.authenticate(authenticationAccountDTO)
    expect(createSessionRepositorySpy.params.account_id).toBe(getAccountByEmailRepositorySpy.account.id)
    expect(createSessionRepositorySpy.params.type).toBe(SessionType.authentication)
  })

  test('Should throw if CreateSessionRepository throws', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    jest.spyOn(createSessionRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.authenticate(mockAuthenticationAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterSpy, createSessionRepositorySpy } = makeSut()
    const authenticationAccountDTO = mockAuthenticationAccountDTO()
    await sut.authenticate(authenticationAccountDTO)
    expect(encrypterSpy.plainText).toBe(createSessionRepositorySpy.session.id)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.authenticate(mockAuthenticationAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AuthenticationModel if HashComparer return true', async () => {
    const { sut, encrypterSpy, getAccountByEmailRepositorySpy } = makeSut()
    const authenticationModel = await sut.authenticate(mockAuthenticationAccountDTO())
    expect(authenticationModel).toEqual({
      access_token: encrypterSpy.encryptedText,
      account_type: getAccountByEmailRepositorySpy.account.type
    })
  })
})
