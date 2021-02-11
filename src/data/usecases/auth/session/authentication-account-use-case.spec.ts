import { DbAuthenticationAccount } from './authentication-account-use-case'
import { mockAuthenticationAccountDTO, throwError, HashComparerSpy, mockAccountModel, EncrypterSpy, CreateSessionRepositorySpy, CacheCreateSpy, CacheRecoverSpy } from '@/data/test'
import { GetAccountByEmailRepositorySpy } from '@/data/test/auth/account/mock-account-repository'
import { SessionType } from '@/domain/models/auth'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbAuthenticationAccount
  cacheRecoverSpy: CacheRecoverSpy
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  cacheCreateSpy: CacheCreateSpy
  createSessionRepositorySpy: CreateSessionRepositorySpy
  encrypterSpy: EncrypterSpy  
}

const makeSut = (): sutTypes => {
  const cacheRecoverSpy = new CacheRecoverSpy()
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  getAccountByEmailRepositorySpy.account = mockAccountModel()
  const hashComparerSpy = new HashComparerSpy()
  const cacheCreateSpy = new CacheCreateSpy()
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const encrypterSpy = new EncrypterSpy()
  const sut = new DbAuthenticationAccount(cacheRecoverSpy, getAccountByEmailRepositorySpy, hashComparerSpy, cacheCreateSpy, createSessionRepositorySpy, encrypterSpy)
  return {
    sut,
    cacheRecoverSpy,
    getAccountByEmailRepositorySpy,
    hashComparerSpy,
    cacheCreateSpy,
    createSessionRepositorySpy,
    encrypterSpy
  }
}

describe('DbAuthenticationAccount', () => {
  test('Should call CacheRecover with correct value', async () => {
    const { sut, cacheRecoverSpy } = makeSut()
    const authenticationAccountDTO = mockAuthenticationAccountDTO()
    await sut.authenticate(authenticationAccountDTO)    
    expect(cacheRecoverSpy.key).toBe(`account:${authenticationAccountDTO.email}`)
  })

  test('Should throw if CacheRecover throws', async () => {
    const { sut, cacheRecoverSpy } = makeSut()
    jest.spyOn(cacheRecoverSpy, 'recover').mockImplementationOnce(throwError)
    const promise = sut.authenticate(mockAuthenticationAccountDTO())
    await expect(promise).rejects.toThrow()
  })  

  test('Should not call GetAccountByEmailRepository if CacheRecover return a account', async () => {
    const { sut, cacheRecoverSpy, getAccountByEmailRepositorySpy } = makeSut()
    cacheRecoverSpy.result = getAccountByEmailRepositorySpy.account
    const getAccountByEmailSpy = jest.spyOn(getAccountByEmailRepositorySpy, 'getAccountByEmail') 
    await sut.authenticate(mockAuthenticationAccountDTO())    
    expect(getAccountByEmailSpy).not.toBeCalled()
  })

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

  test('Should return null if GetAccountByEmailRepository return null', async () => {
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

  test('Should not call CacheCreate if exists Account with e-mail in Cache', async () => {
    const { sut, cacheRecoverSpy, getAccountByEmailRepositorySpy, cacheCreateSpy } = makeSut()
    cacheRecoverSpy.result = getAccountByEmailRepositorySpy.account
    const createCacheSpy = jest.spyOn(cacheCreateSpy, 'create') 
    await sut.authenticate(mockAuthenticationAccountDTO())    
    expect(createCacheSpy).not.toBeCalled()    
  })

  test('Should call CacheCreate with correct value', async () => {
    const { sut, cacheCreateSpy, getAccountByEmailRepositorySpy } = makeSut()
    const authenticationAccountDTO = mockAuthenticationAccountDTO()
    await sut.authenticate(authenticationAccountDTO)        
    expect(cacheCreateSpy.key).toBe(`account:${authenticationAccountDTO.email}`)
    expect(cacheCreateSpy.record).toBe(getAccountByEmailRepositorySpy.account)
  })

  test('Should throw if CacheCreate throws', async () => {
    const { sut, cacheCreateSpy } = makeSut()
    jest.spyOn(cacheCreateSpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.authenticate(mockAuthenticationAccountDTO())
    await expect(promise).rejects.toThrow()
  })  

  test('Should call CreateSessionRepository with correct value', async () => {
    const { sut, createSessionRepositorySpy, getAccountByEmailRepositorySpy } = makeSut()
    await sut.authenticate(mockAuthenticationAccountDTO())
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
      account: {
        id: getAccountByEmailRepositorySpy.account.id,
        name: getAccountByEmailRepositorySpy.account.name
      }
    })
  })
})
