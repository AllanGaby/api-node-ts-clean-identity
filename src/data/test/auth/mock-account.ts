import { AddAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import faker from 'faker'

export const makeAddAccountDTO = (): AddAccountDTO => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

export const mockAccountModel = (): AccountModel => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.random.uuid(),
  created_at: faker.date.past(),
  updated_at: faker.date.past()
})
