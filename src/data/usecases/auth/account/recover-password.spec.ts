import { DbRecoverPassword } from './recover-password'
import { GetSessionByIdRepositorySpy, mockRecoverPasswordDTO, throwError, GetAccountByIdRepositorySpy, mockSessionModel, HashCreatorSpy, UpdateAccountRepositorySpy } from '@/data/test'
import { SessionType } from '@/domain/models/auth'

interface sutTypes {
  sut: DbRecoverPassword
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
  hashCreatorSpy: HashCreatorSpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  getSessionByIdRepositorySpy.session = mockSessionModel(SessionType.recoverPassword)
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const hashCreatorSpy = new HashCreatorSpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const sut = new DbRecoverPassword(getSessionByIdRepositorySpy, getAccountByIdRepositorySpy, hashCreatorSpy, updateAccountRepositorySpy)
  return {
    sut,
    getSessionByIdRepositorySpy,
    getAccountByIdRepositorySpy,
    hashCreatorSpy,
    updateAccountRepositorySpy
  }
}

describe('DbRecoverPassword', () => {
  test('Should call GetSessionByIdRepository with correct value', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const recoverPasswordDTO = mockRecoverPasswordDTO()
    await sut.recover(recoverPasswordDTO)
    expect(getSessionByIdRepositorySpy.sessionId).toBe(recoverPasswordDTO.sessionId)
  })

  test('Should throw if GetSessionByIdRepository throws', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    jest.spyOn(getSessionByIdRepositorySpy, 'getSessionById').mockImplementationOnce(throwError)
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetSessionByIdRepository return null', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session = null
    const account = await sut.recover(mockRecoverPasswordDTO())
    expect(account).toBe(null)
  })

  test('Should return null if GetSessionByIdRepository return an invalid type session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session.type = SessionType.activeAccount
    const account = await sut.recover(mockRecoverPasswordDTO())
    expect(account).toBe(null)
  })

  test('Should return null if GetSessionByIdRepository return an expired session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const experiedAt = new Date()
    getSessionByIdRepositorySpy.session.experied_at = new Date(experiedAt.getDate() - 1)
    const account = await sut.recover(mockRecoverPasswordDTO())
    expect(account).toBe(null)
  })

  test('Should return null if GetSessionByIdRepository return an deleted session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session.deleted_at = new Date()
    const account = await sut.recover(mockRecoverPasswordDTO())
    expect(account).toBe(null)
  })

  test('Should call GetAccountByIdRepository with correct value', async () => {
    const { sut, getSessionByIdRepositorySpy, getAccountByIdRepositorySpy } = makeSut()
    await sut.recover(mockRecoverPasswordDTO())
    expect(getAccountByIdRepositorySpy.accountId).toBe(getSessionByIdRepositorySpy.session.accountId)
  })

  test('Should throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call HashCreator with correct value', async () => {
    const { sut, hashCreatorSpy } = makeSut()
    const recoverPasswordDTO = mockRecoverPasswordDTO()
    await sut.recover(recoverPasswordDTO)
    expect(hashCreatorSpy.payload).toBe(recoverPasswordDTO.password)
  })

  test('Should throw if HashCreator throws', async () => {
    const { sut, hashCreatorSpy } = makeSut()
    jest.spyOn(hashCreatorSpy, 'createHash').mockImplementationOnce(throwError)
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccountRepository with correct value', async () => {
    const { sut, hashCreatorSpy, updateAccountRepositorySpy, getAccountByIdRepositorySpy } = makeSut()
    await sut.recover(mockRecoverPasswordDTO())
    expect(updateAccountRepositorySpy.account.id).toEqual(getAccountByIdRepositorySpy.account.id)
    expect(updateAccountRepositorySpy.account.password).toEqual(hashCreatorSpy.hash)
  })

  test('Should throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    jest.spyOn(updateAccountRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow()
  })
})
