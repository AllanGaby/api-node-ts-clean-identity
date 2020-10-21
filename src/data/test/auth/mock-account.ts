import { CreateAccountDTO, UpdateAccountDTO, SendMailActiveAccountDTO, AuthenticationAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import faker from 'faker'

export const mockCreateAccountDTO = (): CreateAccountDTO => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockUpdateAccountDTO = (): UpdateAccountDTO => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  email_valided: true,
  password: faker.random.uuid(),
  created_at: faker.date.past(),
  updated_at: faker.date.past()
})

export const mockSendMailActiveAccountDTO = (subject: string = faker.random.words()): SendMailActiveAccountDTO => ({
  accountId: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  mailFilePath: faker.internet.url(),
  subject
})

export const mockAuthenticationAccountDTO = (): AuthenticationAccountDTO => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
