import { HttpRequest } from '@/presentation/protocols'
import { CreateAccount, CreateAccountDTO } from '@/domain/usecases/auth/account'
import { SessionModel } from '@/domain/models/auth'
import faker from 'faker'

export class CreateAccountSpy implements CreateAccount {
  createdAccount: SessionModel
  params: CreateAccountDTO

  async create (params: CreateAccountDTO): Promise<SessionModel> {
    this.params = params
    return this.createdAccount
  }
}

export const mockCreateAccountRequest = (): HttpRequest => {
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }
}
