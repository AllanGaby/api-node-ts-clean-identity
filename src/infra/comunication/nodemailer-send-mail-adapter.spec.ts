import { NodemailerSendMailAdapter, SMTPConfig } from './nodemailer-send-mail-adapter'
import { mockSMTPConfig, mockSendMailDTO } from '@/infra/tests/comunication'
import nodemailer from 'nodemailer'
import faker from 'faker'

interface sutTypes {
  sut: NodemailerSendMailAdapter
}

const makeSut = (options: SMTPConfig): sutTypes => ({
  sut: new NodemailerSendMailAdapter(options)
})

describe('NodemailerSendMailAdapter', () => {
  describe('Constructor Method', () => {
    test('Should create nodemailer client without service', async () => {
      const smtp = mockSMTPConfig()
      smtp.port = faker.random.number(9999)
      smtp.host = faker.internet.url()
      smtp.secure = true
      const createTransportSpy = jest.spyOn(nodemailer, 'createTransport')
      makeSut(smtp)
      expect(createTransportSpy).toHaveBeenCalledWith({
        ...smtp,
        tls: {
          rejectUnauthorized: false
        }
      })
    })

    test('Should create nodemailer with service', async () => {
      const smtp = mockSMTPConfig()
      smtp.service = faker.random.uuid()
      const createTransportSpy = jest.spyOn(nodemailer, 'createTransport')
      makeSut(smtp)
      expect(createTransportSpy).toHaveBeenCalledWith({
        ...smtp
      })
    })
  })

  describe('SendMail Method', () => {
    test('Should call sendMail with correct value', async () => {
      const { sut } = makeSut(mockSMTPConfig())
      jest.spyOn(sut.client, 'sendMail').mockImplementationOnce((options: any) => { return undefined })
      const sendMailSpy = jest.spyOn(sut.client, 'sendMail')
      const request = mockSendMailDTO()
      await sut.sendMail(request)
      expect(sendMailSpy).toHaveBeenCalledWith({
        from: {
          name: request.sender.name,
          address: request.sender.email
        },
        to: {
          name: request.to.name,
          address: request.to.email
        },
        subject: request.subject,
        html: request.content
      })
    })
  })
})
