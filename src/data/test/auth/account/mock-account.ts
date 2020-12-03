import { CreateAccountDTO, UpdateAccountDTO, AuthenticationAccountDTO, ListAccountFilter, ShowAccountFilter, SetAccountTypeDTO, GetAvatarFilter } from '@/domain/usecases/auth/account'
import { AccountModel, AccountType, AuthenticationModel } from '@/domain/models/auth'
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
  type: AccountType.student,
  password: faker.random.uuid(),
  created_at: faker.date.past(),
  updated_at: faker.date.past()
})

export const mockAuthenticationAccountDTO = (): AuthenticationAccountDTO => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationModel = (accountType: AccountType = AccountType.student): AuthenticationModel => ({
  access_token: faker.random.uuid(),
  account_type: accountType
})

export const mockListAccountFilter = (): ListAccountFilter => ({
  name: faker.name.findName(),
  email: faker.internet.email()
})

export const mockShowAccountFilter = (): ShowAccountFilter => ({
  accountId: faker.random.uuid()
})

export const mockSetAccountTypeDTO = (accountType: AccountType = AccountType.student): SetAccountTypeDTO => ({
  accountType,
  accountId: faker.random.uuid()
})

export const mockGetAvatarFilter = (): GetAvatarFilter => ({
  accountId: faker.random.uuid()
})
