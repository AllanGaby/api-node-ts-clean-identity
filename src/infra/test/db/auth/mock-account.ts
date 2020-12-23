import { CreateAccountModel, UpdateAccountDTO } from '@/data/repositories/auth/account'
import { AccountType } from '@/domain/models/auth'
import faker from 'faker'

export const mockCreateAccountModel = (): CreateAccountModel => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockUpdateAccountDTO = (id: string = faker.random.uuid(), type: AccountType = AccountType.student): UpdateAccountDTO => ({
  id,
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  email_valided: false,
  type
})
