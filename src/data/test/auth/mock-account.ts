import { CreateAccountDTO, UpdateAccountDTO, SendMailAccountDTO, AuthenticationAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import faker from 'faker'
import path from 'path'

export const mockCreateAccountDTO = (): CreateAccountDTO => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockUpdateAccountDTO = (): UpdateAccountDTO => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  avatarFilePath: `${faker.system.directoryPath()}${path.sep}${faker.system.filePath()}`
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

export const mockSendMailAccountDTO = (sessionType: SessionType, subject: string = faker.random.words()): SendMailAccountDTO => ({
  accountId: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  mailFilePath: faker.internet.url(),
  subject,
  sessionType
})

export const mockAuthenticationAccountDTO = (): AuthenticationAccountDTO => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
