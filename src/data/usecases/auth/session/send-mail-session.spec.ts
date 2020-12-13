import { CreateSessionRepositorySpy, mockSendMailSessionDTO, SendMailSpy, throwError } from '@/data/test'
import { SessionType } from '@/domain/models/auth'
import { DbSendMailSession } from './send-mail-session'

interface sutTypes {
  sut: DbSendMailSession
  createSessionRepositorySpy: CreateSessionRepositorySpy
  sendMailSpy: SendMailSpy
}

const makeSut = (): sutTypes => {
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const sendMailSpy = new SendMailSpy()
  const sut = new DbSendMailSession(createSessionRepositorySpy, sendMailSpy)
  return {
    sut,
    createSessionRepositorySpy,
    sendMailSpy
  }
}

describe('DbSendMailSession', () => {
  test('Should call CreateSessionRepository with correct value', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    const sendMailAccountDTO = mockSendMailSessionDTO(SessionType.activeAccount)
    await sut.sendMail(sendMailAccountDTO)
    expect(createSessionRepositorySpy.params.account_id).toBe(sendMailAccountDTO.accountId)
    expect(createSessionRepositorySpy.params.type).toBe(sendMailAccountDTO.sessionType)
  })

  test('Should throw if CreateSessionRepository throws', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    jest.spyOn(createSessionRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailSessionDTO(SessionType.activeAccount))
    await expect(promise).rejects.toThrow()
  })
})
