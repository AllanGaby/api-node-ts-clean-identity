import { DbActiveAccountUseCase } from './active-account-use-case'
import { mockActiveAccountDTO, throwError, GetSessionByIdRepositorySpy, DeleteSessionByIdRepositorySpy, GetAccountByIdRepositorySpy, UpdateAccountRepositorySpy } from '@/data/tests'
import { SessionType } from '@/domain/models/auth'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbActiveAccountUseCase
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
  deleteSessionByIdRepositorySpy: DeleteSessionByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const deleteSessionByIdRepositorySpy = new DeleteSessionByIdRepositorySpy()
  const sut = new DbActiveAccountUseCase(getSessionByIdRepositorySpy, getAccountByIdRepositorySpy, updateAccountRepositorySpy, deleteSessionByIdRepositorySpy)
  return {
    sut,
    getSessionByIdRepositorySpy,
    getAccountByIdRepositorySpy,
    updateAccountRepositorySpy,
    deleteSessionByIdRepositorySpy
  }
}

describe('DbActiveAccountUseCase', () => {
  test('Should call GetSessionByIdRepository with correct values', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const activeAccountDTO = mockActiveAccountDTO()
    await sut.active(activeAccountDTO)
    expect(getSessionByIdRepositorySpy.sessionId).toBe(activeAccountDTO.sessionId)
  })

  test('Should throw if GetSessionByIdRepository throws', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    jest.spyOn(getSessionByIdRepositorySpy, 'getSessionById').mockImplementationOnce(throwError)
    const promise = sut.active(mockActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null GetSessionByIdRepository return null', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session = null
    const promise = sut.active(mockActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetSessionByIdRepository return session with invalid type', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session.type = SessionType.recoverPassword
    const promise = sut.active(mockActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetSessionByIdRepository return expired session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const experiedAt = new Date()
    getSessionByIdRepositorySpy.session.experied_at = new Date(experiedAt.getDate() - 1)
    const promise = sut.active(mockActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetSessionByIdRepository return deleted session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session.deleted_at = new Date()
    const promise = sut.active(mockActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call GetAccountByIdRepository with correct values', async () => {
    const { sut, getSessionByIdRepositorySpy, getAccountByIdRepositorySpy } = makeSut()
    const activeAccountDTO = mockActiveAccountDTO()
    await sut.active(activeAccountDTO)
    expect(getAccountByIdRepositorySpy.accountId).toBe(getSessionByIdRepositorySpy.session.account_id)
  })

  test('Should throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.active(mockActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return InvalidCredentialError if GetAccountByIdRepository return an account with valided email', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const promise = sut.active(mockActiveAccountDTO())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should return null if GetAccountByIdRepository return an account with valided email', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account.email_valided = true
    const activeAccountDTO = mockActiveAccountDTO()
    const account = await sut.active(activeAccountDTO)
    expect(account).toEqual(getAccountByIdRepositorySpy.account)
  })

  test('Should call UpdateAccountRepository with correct value', async () => {
    const { sut, getAccountByIdRepositorySpy, updateAccountRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account.email_valided = false
    await sut.active(mockActiveAccountDTO())
    const updatedAccount = getAccountByIdRepositorySpy.account
    updatedAccount.email_valided = true
    expect(updateAccountRepositorySpy.params).toEqual(updatedAccount)
  })

  test('Should throw if UpdateAccountRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy, updateAccountRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account.email_valided = false
    jest.spyOn(updateAccountRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.active(mockActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return account updated if GetAccountByIdRepository return an account with invalided email', async () => {
    const { sut, updateAccountRepositorySpy, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account.email_valided = false
    const account = await sut.active(mockActiveAccountDTO())
    expect(account.id).toBe(updateAccountRepositorySpy.account.id)
    expect(account.name).toBe(updateAccountRepositorySpy.account.name)
    expect(account.email).toBe(updateAccountRepositorySpy.account.email)
    expect(account.email_valided).toBe(updateAccountRepositorySpy.account.email_valided)
  })

  test('Should call DeleteSessionRepository with correct value', async () => {
    const { sut, getAccountByIdRepositorySpy, getSessionByIdRepositorySpy, deleteSessionByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account.email_valided = false
    await sut.active(mockActiveAccountDTO())
    expect(deleteSessionByIdRepositorySpy.sessionId).toEqual(getSessionByIdRepositorySpy.session.id)
  })

  test('Should throw if DeleteSessionRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy, deleteSessionByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account.email_valided = false
    jest.spyOn(deleteSessionByIdRepositorySpy, 'deleteById').mockImplementationOnce(throwError)
    const promise = sut.active(mockActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})
