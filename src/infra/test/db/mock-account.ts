import { CreateAccountModel, UpdateAccountModel } from '@/data/repositories/auth/account'
import faker from 'faker'

export const mockCreateAccountModel = (): CreateAccountModel => ({
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password()
})

export const mockUpdateAccountModel = (emailValided: boolean = true, accessProfileId: string = undefined): UpdateAccountModel => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  email_valided: emailValided,
  accessProfileId
})
