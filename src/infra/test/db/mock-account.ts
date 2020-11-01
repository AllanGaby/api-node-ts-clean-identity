import { CreateAccountModel } from '@/data/repositories/auth/account'
import faker from 'faker'

export const mockCreateAccountModel = (): CreateAccountModel => ({
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password()
})
