import { SendMailContact, SendMailVariables, SendMailDTO } from '@/domain/usecases/utils'
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
