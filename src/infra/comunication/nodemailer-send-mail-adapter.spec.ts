import { NodemailerSendMailAdapter, SMTPConfig } from './nodemailer-send-mail-adapter'
import { mockSMTPConfig } from '@/infra/tests/comunication'
import nodemailer from 'nodemailer'
import faker from 'faker'

interface sutTypes {
  sut: NodemailerSendMailAdapter
}

const makeSut = (options: SMTPConfig): sutTypes => {
  const sut = new NodemailerSendMailAdapter(options)
  return {
    sut
  }
}

describe('NodemailerSendMailAdapter', () => {
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
