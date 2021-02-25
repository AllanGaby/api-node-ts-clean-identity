import { ShowAvatarAccountController } from './show-avatar-account-controller'
import { mockShowAvatarAccountRequest, ShowAvatarAccountUseCaseSpy } from '@/presentation/tests/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/tests'
import { AccountNotFoundError } from '@/data/errors'

interface sutTypes {
  sut: ShowAvatarAccountController
  showAvatarAccount: ShowAvatarAccountUseCaseSpy
}

const makeSut = (): sutTypes => {
  const showAvatarAccount = new ShowAvatarAccountUseCaseSpy()
  const sut = new ShowAvatarAccountController(showAvatarAccount)
  return {
    sut,
    showAvatarAccount
  }
}

describe('ShowAvatarAccountController', () => {
  test('Should call ShowAvatarAccount with correct values', async () => {
    const { sut, showAvatarAccount } = makeSut()
    const request = mockShowAvatarAccountRequest()
    await sut.handle(request)
    expect(showAvatarAccount.params).toEqual({
      accountId: request.params.account_id
    })
  })

  test('Should return ServerError if ShowAvatarAccount usecase throws', async () => {
    const { sut, showAvatarAccount } = makeSut()
    jest.spyOn(showAvatarAccount, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockShowAvatarAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return BadRequest if ShowAvatarAccount return AccountNotFoundError', async () => {
    const { sut, showAvatarAccount } = makeSut()
    jest.spyOn(showAvatarAccount, 'show').mockImplementationOnce(() => { throw new AccountNotFoundError() })
    const result = await sut.handle(mockShowAvatarAccountRequest())
    expect(result).toEqual(badRequest(new AccountNotFoundError()))
  })

  test('Should return Ok and correct entity if usecase is succeeds', async () => {
    const { sut, showAvatarAccount } = makeSut()
    const result = await sut.handle(mockShowAvatarAccountRequest())
    expect(result).toEqual(ok(showAvatarAccount.filePath))
  })
})
