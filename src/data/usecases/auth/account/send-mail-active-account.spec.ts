import { CreateSessionRepositorySpy, mockSendMailActiveAccountDTO, throwError } from '@/data/test'
import { SessionType } from '@/domain/models/auth'
import { DbSendMailActiveAccount } from './send-mail-active-account'

interface sutTypes {
  sut: DbSendMailActiveAccount
  createSessionRepositorySpy: CreateSessionRepositorySpy
}

const makeSut = (): sutTypes => {
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const sut = new DbSendMailActiveAccount(createSessionRepositorySpy)
  return {
    sut,
    createSessionRepositorySpy
  }
}

describe('DbSendMailActiveAccount', () => {
  test('Should call CreateSessionRepository with correct value', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    const sendMailActiveAccountDTO = mockSendMailActiveAccountDTO()
    await sut.sendMail(sendMailActiveAccountDTO)
    expect(createSessionRepositorySpy.addSessionParams.accountId).toBe(sendMailActiveAccountDTO.accountId)
    expect(createSessionRepositorySpy.addSessionParams.type).toBe(SessionType.activeAccount)
  })

  test('Should throw if CreateSessionRepository throws', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    jest.spyOn(createSessionRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})
