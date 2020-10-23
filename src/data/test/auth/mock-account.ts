import { CreateAccountDTO, UpdateAccountDTO, AuthenticationAccountDTO, ListAccountFilter } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
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

export const mockAuthenticationAccountDTO = (): AuthenticationAccountDTO => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockListAccountFilter = (): ListAccountFilter => ({
  name: faker.name.findName(),
  email: faker.internet.email()
})
