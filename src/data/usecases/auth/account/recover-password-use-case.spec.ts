import { DbRecoverPasswordUseCase } from './recover-password-use-case'
import { GetSessionByIdRepositorySpy, mockRecoverPasswordDTO, throwError, GetAccountByIdRepositorySpy, mockSessionModel, HashCreatorSpy, UpdateAccountRepositorySpy, DeleteSessionByAccountIdRepositorySpy } from '@/data/test'
import { SessionType } from '@/domain/models/auth'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbRecoverPasswordUseCase
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
  hashCreatorSpy: HashCreatorSpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
  deleteSessionByAccountIdRepositorySpy: DeleteSessionByAccountIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  getSessionByIdRepositorySpy.session = mockSessionModel(SessionType.recoverPassword)
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const hashCreatorSpy = new HashCreatorSpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const deleteSessionByAccountIdRepositorySpy = new DeleteSessionByAccountIdRepositorySpy()
  const sut = new DbRecoverPasswordUseCase(getSessionByIdRepositorySpy, getAccountByIdRepositorySpy, hashCreatorSpy, updateAccountRepositorySpy, deleteSessionByAccountIdRepositorySpy)
  return {
    sut,
    getSessionByIdRepositorySpy,
    getAccountByIdRepositorySpy,
    hashCreatorSpy,
    updateAccountRepositorySpy,
    deleteSessionByAccountIdRepositorySpy
  }
}

describe('DbRecoverPasswordUseCase', () => {
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

  test('Should return InvalidCredentialsError if GetSessionByIdRepository return null', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session = null
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should return InvalidCredentialsError if GetSessionByIdRepository return an invalid type session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session.type = SessionType.activeAccount
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should return InvalidCredentialsError if GetSessionByIdRepository return an expired session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const experiedAt = new Date()
    getSessionByIdRepositorySpy.session.experied_at = new Date(experiedAt.getDate() - 1)
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should return InvalidCredentialsError if GetSessionByIdRepository return an deleted session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session.deleted_at = new Date()
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should call GetAccountByIdRepository with correct value', async () => {
    const { sut, getSessionByIdRepositorySpy, getAccountByIdRepositorySpy } = makeSut()
    await sut.recover(mockRecoverPasswordDTO())
    expect(getAccountByIdRepositorySpy.accountId).toBe(getSessionByIdRepositorySpy.session.account_id)
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
    expect(updateAccountRepositorySpy.params.id).toEqual(getAccountByIdRepositorySpy.account.id)
    expect(updateAccountRepositorySpy.params.password).toEqual(hashCreatorSpy.hash)
  })

  test('Should throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    jest.spyOn(updateAccountRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call DeleteSessionByAccountId with correct value', async () => {
    const { sut, getSessionByIdRepositorySpy, deleteSessionByAccountIdRepositorySpy } = makeSut()
    await sut.recover(mockRecoverPasswordDTO())
    expect(deleteSessionByAccountIdRepositorySpy.accountId).toEqual(getSessionByIdRepositorySpy.session.account_id)
  })

  test('Should throw if DeleteSessionByAccountId throws', async () => {
    const { sut, deleteSessionByAccountIdRepositorySpy } = makeSut()
    jest.spyOn(deleteSessionByAccountIdRepositorySpy, 'deleteByAccountId').mockImplementationOnce(throwError)
    const promise = sut.recover(mockRecoverPasswordDTO())
    await expect(promise).rejects.toThrow()
  })
})
