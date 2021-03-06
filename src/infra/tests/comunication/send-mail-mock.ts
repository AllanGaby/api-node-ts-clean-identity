import { SendMailDTO } from '@/data/protocols/comunication/mail'
import faker from 'faker'

export const mockSendMailDTO = (): SendMailDTO => ({
  content: faker.random.words(),
  subject: faker.random.words(),
  sender: {
    name: faker.name.findName(),
    email: faker.internet.email()
  },
  to: {
    name: faker.name.findName(),
    email: faker.internet.email()
  }
})
