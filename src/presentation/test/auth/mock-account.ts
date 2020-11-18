import { HttpRequest } from '@/presentation/protocols'
import { CreateAccount, CreateAccountDTO, UpdateAccount, UpdateAccountDTO, ActiveAccount, ActiveAccountDTO, AuthenticationAccount, AuthenticationAccountDTO, ListAccount, ListAccountFilter, RecoverPassword, RecoverPasswordDTO, RequestRecoverPassword, RequestRecoverPasswordDTO, SetAccountType, SetAccountTypeDTO } from '@/domain/usecases/auth/account'
import { AccountModel, SessionModel, AuthenticationModel, AccountType } from '@/domain/models/auth'
import faker from 'faker'
import { mockAccountModel, mockAuthenticationModel, mockSessionModel, mockListAccountFilter } from '@/data/test'
import { CreateAccountRequest, ActiveAccountRequest, AuthenticationAccountRequest, RecoverPasswordRequest } from '@/presentation/controllers/auth/account'

export class CreateAccountSpy implements CreateAccount {
  session: SessionModel = mockSessionModel()
  params: CreateAccountDTO

  async create (params: CreateAccountDTO): Promise<SessionModel> {
    this.params = params
    return this.session
  }
}

export const mockCreateAccountRequest = (): HttpRequest<CreateAccountRequest> => {
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

export class UpdateAccountSpy implements UpdateAccount {
  params: UpdateAccountDTO
  account: AccountModel = mockAccountModel()

  async update (params: UpdateAccountDTO): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

export const mockActiveAccountRequest = (): HttpRequest<ActiveAccountRequest> => ({
  body: {
    sessionId: faker.random.uuid()
  }
})

export class ActiveAccountSpy implements ActiveAccount {
  params: ActiveAccountDTO
  account: AccountModel = mockAccountModel()

  async active (params: ActiveAccountDTO): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

export const mockAuthenticationAccountRequest = (): HttpRequest<AuthenticationAccountRequest> => ({
  body: {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
})

export class AuthenticationAccountSpy implements AuthenticationAccount {
  params: AuthenticationAccountDTO
  authentication: AuthenticationModel = mockAuthenticationModel()

  async authenticate (params: AuthenticationAccountDTO): Promise<AuthenticationModel> {
    this.params = params
    return this.authentication
  }
}

export class ListAccountSpy implements ListAccount {
  params: ListAccountFilter
  accounts: AccountModel[] = [mockAccountModel(), mockAccountModel()]

  async list (params: ListAccountFilter): Promise<AccountModel[]> {
    this.params = params
    return this.accounts
  }
}

export const mockListAccountRequest = (): HttpRequest<ListAccountFilter> => ({
  body: mockListAccountFilter()
})

export class RecoverPasswordSpy implements RecoverPassword {
  params: RecoverPasswordDTO
  account: AccountModel = mockAccountModel()

  async recover (params: RecoverPasswordDTO): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

export const mockRecoverPasswordRequest = (): HttpRequest<RecoverPasswordRequest> => {
  const password = faker.internet.password()
  return {
    body: {
      session_id: faker.random.uuid(),
      password,
      password_confirmation: password
    }
  }
}

export class RequestRecoverPasswordSpy implements RequestRecoverPassword {
  params: RequestRecoverPasswordDTO
  result: boolean = true

  async request (params: RequestRecoverPasswordDTO): Promise<boolean> {
    this.params = params
    return this.result
  }
}

export const mockRequestRecoverPasswordRequest = (): HttpRequest<RequestRecoverPasswordDTO> => ({
  body: {
    email: faker.internet.email()
  }
})

export class SetAccountTypeSpy implements SetAccountType {
  params: SetAccountTypeDTO
  account: AccountModel

  async setAccountType (params: SetAccountTypeDTO): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

export const mockSetAccountTypeRequest = (type: AccountType = AccountType.student): HttpRequest<SetAccountTypeDTO> => ({
  body: {
    accountId: faker.random.uuid(),
    accountType: type
  }
})
