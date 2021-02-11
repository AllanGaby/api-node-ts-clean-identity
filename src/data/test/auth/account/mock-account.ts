import { CreateAccountDTO, UpdateAccountDTO, AuthenticationAccountDTO, ListAccountDTO, ShowAccountDTO, GetFilenameToAccountAvatarDTO } from '@/domain/usecases/auth/account'
import { AccountModel, AuthenticationModel } from '@/domain/models/auth'
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

export const mockAuthenticationModel = (): AuthenticationModel => ({
  access_token: faker.random.uuid(),
  account: {
    name: faker.name.findName(),
    id: faker.random.uuid()
  }
})

export const mockListAccountDTO = (): ListAccountDTO => ({
  name: faker.name.findName(),
  email: faker.internet.email()
})

export const mockShowAccountDTO = (): ShowAccountDTO => ({
  accountId: faker.random.uuid()
})

export const mockGetFilenameToAccountAvatarDTO = (): GetFilenameToAccountAvatarDTO => ({
  accountId: faker.random.uuid(),
  uploadDir: faker.system.directoryPath()
})
