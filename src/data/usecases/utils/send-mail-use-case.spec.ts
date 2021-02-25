import { DbSendMailUseCase } from './send-mail-use-case'
import { MailTemplateAdapterSpy, SendMailAdapterSpy, mockSendMailDTO, throwError } from '@/data/tests'
import faker from 'faker'

interface sutTypes {
  sut: DbSendMailUseCase
  mailTemplateAdapterSpy: MailTemplateAdapterSpy
  sendMailAdapterSpy: SendMailAdapterSpy
}

const makeSut = (): sutTypes => {
  const mailTemplateAdapterSpy = new MailTemplateAdapterSpy()
  const sendMailAdapterSpy = new SendMailAdapterSpy()
  const sut = new DbSendMailUseCase(mailTemplateAdapterSpy, sendMailAdapterSpy)
  return {
    sut,
    mailTemplateAdapterSpy,
    sendMailAdapterSpy
  }
}

describe('DbSendMailUseCase', () => {
  describe('SendMail', () => {
    test('Should call MailTemplateAdapter with correct values', async () => {
      const { sut, mailTemplateAdapterSpy } = makeSut()
      const request = mockSendMailDTO()
      await sut.sendMail(request)
      expect(mailTemplateAdapterSpy.parseParams).toEqual({
        filePath: request.templateFileName,
        variables: request.variables
      })
    })

    test('Should return throw if MailTemplateAdapter throws', async () => {
      const { sut, mailTemplateAdapterSpy } = makeSut()
      jest.spyOn(mailTemplateAdapterSpy, 'parse').mockImplementationOnce(throwError)
      const promise = sut.sendMail(mockSendMailDTO())
      await expect(promise).rejects.toThrow()
    })

    test('Should call SendMailAdapter with correct values', async () => {
      const { sut, mailTemplateAdapterSpy, sendMailAdapterSpy } = makeSut()
      mailTemplateAdapterSpy.mailParsed = faker.random.words()
      const request = mockSendMailDTO()
      await sut.sendMail(request)
      expect(sendMailAdapterSpy.sendMailParams).toEqual({
        to: request.to,
        sender: request.sender,
        subject: request.subject,
        content: mailTemplateAdapterSpy.mailParsed
      })
    })

    test('Should return throw if SendMailAdapter throws', async () => {
      const { sut, sendMailAdapterSpy } = makeSut()
      jest.spyOn(sendMailAdapterSpy, 'sendMail').mockImplementationOnce(throwError)
      const promise = sut.sendMail(mockSendMailDTO())
      await expect(promise).rejects.toThrow()
    })
  })

  describe('Execute', () => {
    test('Should call SendMail with correct values', async () => {
      const { sut } = makeSut()
      const sendMailSpy = jest.spyOn(sut, 'sendMail')
      const request = mockSendMailDTO()
      await sut.execute(request)
      expect(sendMailSpy).toHaveBeenCalledWith(request)
    })
  })
})
