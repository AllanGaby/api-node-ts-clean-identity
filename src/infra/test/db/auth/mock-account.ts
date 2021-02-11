import { CreateAccountModel, UpdateAccountDTO } from '@/data/repositories/auth/account'
import faker from 'faker'

export const mockCreateAccountModel = (): CreateAccountModel => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockUpdateAccountDTO = (id: string = faker.random.uuid()): UpdateAccountDTO => ({
  id,
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  email_valided: false
})
