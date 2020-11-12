import { CreateAccountModel } from '@/data/repositories/auth/account'
import faker from 'faker'

export const mockCreateAccountModel = (): CreateAccountModel => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
