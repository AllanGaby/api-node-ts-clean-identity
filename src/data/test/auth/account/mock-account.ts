import { CreateAccountDTO, UpdateAccountDTO, ShowAccountDTO, ActiveAccountDTO, RecoverPasswordDTO, UploadAvatarAccountDTO } from '@/domain/usecases/auth/account'
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
  newPassword: faker.internet.password()
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

export const mockShowAccountDTO = (): ShowAccountDTO => ({
  accountId: faker.random.uuid()
})

export const mockActiveAccountDTO = (): ActiveAccountDTO => ({
  sessionId: faker.random.uuid()
})

export const mockRecoverPasswordDTO = (): RecoverPasswordDTO => ({
  sessionId: faker.random.uuid(),
  password: faker.internet.password()
})

export const mockUploadAvatarAccountDTO = (): UploadAvatarAccountDTO => ({
  accountId: faker.random.uuid(),
  avatarFilePath: `${faker.system.directoryPath()}${path.sep}${faker.system.filePath()}`
})
