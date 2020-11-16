import { HttpRequest } from '@/presentation/protocols'
import { CreateAccount, CreateAccountDTO } from '@/domain/usecases/auth/account'
import { SessionModel } from '@/domain/models/auth'
import faker from 'faker'
import { mockSessionModel } from '@/data/test'

export class CreateAccountSpy implements CreateAccount {
  session: SessionModel = mockSessionModel()
  params: CreateAccountDTO

  async create (params: CreateAccountDTO): Promise<SessionModel> {
    this.params = params
    return this.session
  }
}

export const mockCreateAccountRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      password_confirmation: password
    }
  }
}
