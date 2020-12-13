import { SendMailContact, SendMailVariables, SendMailDTO, SendMail } from '@/domain/usecases/utils'
import faker from 'faker'

export const mockSendMailContact = (): SendMailContact => ({
  name: faker.name.findName(),
  email: faker.internet.email()
})

export const mockSendMailVariables = (): SendMailVariables => ({
  [faker.database.column()]: faker.random.words(),
  [faker.database.column()]: faker.random.words(),
  [faker.database.column()]: faker.random.words()
})

export const mockSendMailDTO = (): SendMailDTO => ({
  subject: faker.random.words(),
  templateFileName: faker.internet.url(),
  to: mockSendMailContact(),
  variables: mockSendMailVariables(),
  sender: mockSendMailContact()
})

export class SendMailSpy implements SendMail {
  params: SendMailDTO

  async sendMail (params: SendMailDTO): Promise<void> {
    this.params = params
  }
}
