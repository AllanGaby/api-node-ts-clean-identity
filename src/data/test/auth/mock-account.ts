import { AddAccountDTO } from '@/domain/dtos/auth/account'
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
