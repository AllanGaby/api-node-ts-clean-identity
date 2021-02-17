import { HttpRequest } from '@/presentation/protocols'
import { CreateAccountUseCase, CreateAccountDTO, UpdateAccountUseCase, UpdateAccountDTO, ActiveAccountUseCase, ActiveAccountDTO, RecoverPasswordUseCase, RecoverPasswordDTO, RequestRecoverPasswordUseCase, RequestRecoverPasswordDTO, ShowAccountUseCase, ShowAccountDTO, UploadAvatarAccountUseCase, UploadAvatarAccountDTO, ShowAvatarAccountUseCase, ShowAvatarAccountDTO } from '@/domain/usecases/auth/account'
import { AccountModel, SessionModel } from '@/domain/models/auth'
import { mockAccountModel, mockSessionModel } from '@/data/test'
import { CreateAccountRequest, ActiveAccountRequest, RecoverPasswordRequest, UpdateAccountRequest, ShowAccountRequest, UploadAvatarAccountRequest } from '@/presentation/controllers/auth/account'
import { ShowAvatarAccountRequest } from '@/presentation/controllers/auth/account/show-avatar-account-controller'
import faker from 'faker'

export class CreateAccountSpy implements CreateAccountUseCase {
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

export class UpdateAccountSpy implements UpdateAccountUseCase {
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
      session: {
        accountId: faker.random.uuid()
      },
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      password_confirmation: password
    }
  }
}

export class ActiveAccountSpy implements ActiveAccountUseCase {
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

export class RecoverPasswordSpy implements RecoverPasswordUseCase {
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

export class RequestRecoverPasswordSpy implements RequestRecoverPasswordUseCase {
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

export class ShowAccountSpy implements ShowAccountUseCase {
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

export class UploadAvatarAccountUseCaseSpy implements UploadAvatarAccountUseCase {
  params: UploadAvatarAccountDTO
  account: AccountModel = mockAccountModel()

  async upload (params: UploadAvatarAccountDTO): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

export const mockUploadAvatarAccountRequest = (): HttpRequest<UploadAvatarAccountRequest> => ({
  body: {
    avatar_file_path: faker.system.directoryPath() + faker.system.filePath(),
    session: {
      accountId: faker.random.uuid()
    }
  }
})

export class ShowAvatarAccountUseCaseSpy implements ShowAvatarAccountUseCase {
  params: ShowAvatarAccountDTO
  filePath: string = faker.system.directoryPath() + faker.system.filePath()

  async show (params: ShowAvatarAccountDTO): Promise<string> {
    this.params = params
    return this.filePath
  }
}

export const mockShowAvatarAccountRequest = (): HttpRequest<ShowAvatarAccountRequest> => ({
  params: {
    avatar_id: faker.random.uuid()
  }
})
