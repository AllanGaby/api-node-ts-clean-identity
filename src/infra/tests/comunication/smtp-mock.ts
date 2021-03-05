import { SMTPConfig } from '@/infra/comunication'
import faker from 'faker'

export const mockSMTPConfig = (): SMTPConfig => ({
  auth: {
    user: faker.internet.email(),
    pass: faker.internet.password()
  }
})
