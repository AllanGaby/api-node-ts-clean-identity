import { HttpRequest } from '@/presentation/protocols'
import { CreateAccount, CreateAccountDTO, UpdateAccount, UpdateAccountDTO, ActiveAccount, ActiveAccountDTO, AuthenticationAccount, AuthenticationAccountDTO, ListAccount, ListAccountDTO, RecoverPassword, RecoverPasswordDTO, RequestRecoverPassword, RequestRecoverPasswordDTO, SetAccountType, SetAccountTypeDTO, ShowAccount, ShowAccountDTO, GetFilenameToAccountAvatar, GetFilenameToAccountAvatarDTO } from '@/domain/usecases/auth/account'
import { AccountModel, SessionModel, AuthenticationModel, AccountType, AvatarModel } from '@/domain/models/auth'
import { mockAccountModel, mockAuthenticationModel, mockSessionModel, mockListAccountDTO } from '@/data/test'
import { CreateAccountRequest, ActiveAccountRequest, RecoverPasswordRequest, UpdateAccountRequest, SetAccountTypeRequest, ShowAccountRequest, ShowAccountByIdRequest, ShowAvatarAccountRequest } from '@/presentation/controllers/auth/account'
import faker from 'faker'
import path from 'path'

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

export const mockUpdateAccountRequest = (): HttpRequest<UpdateAccountRequest> => {
  const password = faker.internet.password()
  return {
    body: {
      account: {
        id: faker.random.uuid()
      },
      name: faker.name.findName(),
      email: faker.internet.email(),
      avatar_file_path: faker.system.directoryPath() + faker.system.filePath(),
      password,
      password_confirmation: password
    }
  }
}

export class ActiveAccountSpy implements ActiveAccount {
  params: ActiveAccountDTO
  account: AccountModel = mockAccountModel()

  async active (params: ActiveAccountDTO): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

export const mockActiveAccountRequest = (): HttpRequest<ActiveAccountRequest> => ({
  params: {
    session_id: faker.random.uuid()
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

export const mockAuthenticationAccountRequest = (): HttpRequest<AuthenticationAccountDTO> => ({
  body: {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
})

export class ListAccountSpy implements ListAccount {
  params: ListAccountDTO
  accounts: AccountModel[] = [mockAccountModel(), mockAccountModel()]

  async list (params: ListAccountDTO): Promise<AccountModel[]> {
    this.params = params
    return this.accounts
  }
}

export const mockListAccountRequest = (): HttpRequest<ListAccountDTO> => ({
  body: mockListAccountDTO()
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
  session: SessionModel = mockSessionModel()

  async request (params: RequestRecoverPasswordDTO): Promise<SessionModel> {
    this.params = params
    return this.session
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

export const mockSetAccountTypeRequest = (type: AccountType = AccountType.student): HttpRequest<SetAccountTypeRequest> => ({
  body: {
    account_id: faker.random.uuid(),
    account_type: type
  }
})

export class ShowAccountSpy implements ShowAccount {
  params: ShowAccountDTO
  account: AccountModel = mockAccountModel()

  async show (params: ShowAccountDTO): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

export const mockShowAccountRequest = (): HttpRequest<ShowAccountRequest> => ({
  body: {
    session: {
      accountId: faker.random.uuid()
    }
  }
})

export const mockShowAccountByIdRequest = (): HttpRequest<ShowAccountByIdRequest> => ({
  params: {
    account_id: faker.random.uuid()
  }
})

export class GetFilenameToAccountAvatarSpy implements GetFilenameToAccountAvatar {
  params: GetFilenameToAccountAvatarDTO
  avatar: AvatarModel = {
    avatar_file_path: `${faker.system.directoryPath()}${path.sep}${faker.system.fileName()}.${faker.system.fileExt(faker.system.mimeType())}`
  }

  async getPath (params: GetFilenameToAccountAvatarDTO): Promise<AvatarModel> {
    this.params = params
    return this.avatar
  }
}

export const mokeGetFilenameToAccountAvatar = (): HttpRequest<ShowAvatarAccountRequest> => ({
  body: {
    account: {
      id: faker.random.uuid()
    }
  }
})
