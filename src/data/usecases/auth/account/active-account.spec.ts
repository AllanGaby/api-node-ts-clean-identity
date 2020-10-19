import { DbActiveAccount } from './active-account'
import { GetSessionByIdRepositorySpy } from '@/data/test/auth/mock-session-repository'
import { GetAccountByIdRepositorySpy } from '@/data/test/auth/mock-account-repository'
import { mockActiveAccountDTO } from '@/data/test/auth'
import { throwError } from '@/data/test'
import { SessionType } from '@/domain/models/auth'

interface sutTypes {
  sut: DbActiveAccount
  getSessionByIdRepositorySpy: GetSessionByIdRepositorySpy
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getSessionByIdRepositorySpy = new GetSessionByIdRepositorySpy()
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const sut = new DbActiveAccount(getSessionByIdRepositorySpy, getAccountByIdRepositorySpy)
  return {
    sut,
    getSessionByIdRepositorySpy,
    getAccountByIdRepositorySpy
  }
}

describe('DbActiveAccount', () => {
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
    const account = await sut.active(mockActiveAccountDTO())
    expect(account).toBeFalsy()
  })

  test('Should return null if GetSessionByIdRepository return session with invalid type', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session.type = SessionType.recoverPassword
    const account = await sut.active(mockActiveAccountDTO())
    expect(account).toBeFalsy()
  })

  test('Should return null if GetSessionByIdRepository return expired session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    const experiedAt = new Date()
    getSessionByIdRepositorySpy.session.experied_at = new Date(experiedAt.getDate() - 1)
    const account = await sut.active(mockActiveAccountDTO())
    expect(account).toBeFalsy()
  })

  test('Should return null if GetSessionByIdRepository return deleted session', async () => {
    const { sut, getSessionByIdRepositorySpy } = makeSut()
    getSessionByIdRepositorySpy.session.deleted_at = new Date()
    const account = await sut.active(mockActiveAccountDTO())
    expect(account).toBeFalsy()
  })

  test('Should call GetAccountByIfRepository with correct values', async () => {
    const { sut, getSessionByIdRepositorySpy, getAccountByIdRepositorySpy } = makeSut()
    const activeAccountDTO = mockActiveAccountDTO()
    await sut.active(activeAccountDTO)
    expect(getAccountByIdRepositorySpy.accountId).toBe(getSessionByIdRepositorySpy.session.accountId)
  })
})
