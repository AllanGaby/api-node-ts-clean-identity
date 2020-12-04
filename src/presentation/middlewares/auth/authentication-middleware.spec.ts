import { AuthenticationMiddleware } from './authentication-middleware'
import { ShowAccountSpy, mockAuthenticationRequest, mockAuthenticationFailRequest, ShowSessionByAccessTokenSpy } from '@/presentation/test/auth'
import { AccountType, SessionType } from '@/domain/models/auth'
import { badRequest, forbidden, serverError, ok } from '@/presentation/helpers'
import { MissingParamError } from '@/validation/errors'
import { throwError } from '@/data/test'
import { AccessDeniedError } from '@/presentation/errors'

interface sutTypes {
  sut: AuthenticationMiddleware
  showSessionByAccessTokenSpy: ShowSessionByAccessTokenSpy
  showAccountSpy: ShowAccountSpy
}

const makeSut = (accountType: AccountType[] = [AccountType.student]): sutTypes => {
  const showSessionByAccessTokenSpy = new ShowSessionByAccessTokenSpy()
  const showAccountSpy = new ShowAccountSpy()
  let sut: AuthenticationMiddleware
  if (!accountType) {
    sut = new AuthenticationMiddleware(showSessionByAccessTokenSpy, showAccountSpy)
  } else {
    sut = new AuthenticationMiddleware(showSessionByAccessTokenSpy, showAccountSpy, accountType)
  }
  return {
    sut,
    showSessionByAccessTokenSpy,
    showAccountSpy
  }
}

describe('AuthenticationMiddleware', () => {
  test('Should return BadRequest token not found', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(mockAuthenticationFailRequest())
    expect(result).toEqual(badRequest(new MissingParamError('x-access-token')))
  })

  test('Should return BadRequest if request headers not found', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({})
    expect(result).toEqual(badRequest(new MissingParamError('x-access-token')))
  })

  test('Should call ShowSessiontByAccessToken with correct value', async () => {
    const { sut, showSessionByAccessTokenSpy } = makeSut()
    const request = mockAuthenticationRequest()
    await sut.handle(request)
    expect(showSessionByAccessTokenSpy.params).toEqual({
      accessToken: request.headers?.['x-access-token']
    })
  })

  test('Should return ServerError if ShowSessiontByAccessToken throws', async () => {
    const { sut, showSessionByAccessTokenSpy } = makeSut()
    jest.spyOn(showSessionByAccessTokenSpy, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Forbidden if session is not found', async () => {
    const { sut, showSessionByAccessTokenSpy } = makeSut()
    showSessionByAccessTokenSpy.session = null
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return Forbidden if account type is different of authentication', async () => {
    const { sut, showSessionByAccessTokenSpy } = makeSut()
    showSessionByAccessTokenSpy.session.type = SessionType.activeAccount
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call ShowAccount with correct value', async () => {
    const { sut, showAccountSpy, showSessionByAccessTokenSpy } = makeSut()
    const request = mockAuthenticationRequest()
    await sut.handle(request)
    expect(showAccountSpy.params.accountId).toEqual(showSessionByAccessTokenSpy.session.account_id)
  })

  test('Should return ServerError if ShowAccount throws', async () => {
    const { sut, showAccountSpy } = makeSut()
    jest.spyOn(showAccountSpy, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Forbidden if account is not found', async () => {
    const { sut, showAccountSpy } = makeSut()
    showAccountSpy.account = null
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return Forbidden if account type is different', async () => {
    const { sut, showAccountSpy } = makeSut([AccountType.manager])
    showAccountSpy.account.type = AccountType.student
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return an Account if succeeds', async () => {
    const { sut, showAccountSpy, showSessionByAccessTokenSpy } = makeSut()
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(ok({
      accountId: showAccountSpy.account.id,
      sessionId: showSessionByAccessTokenSpy.session.id
    }))
  })

  test('Should return an Account if succeeds without account type check', async () => {
    const { sut, showAccountSpy, showSessionByAccessTokenSpy } = makeSut(null)
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(ok({
      accountId: showAccountSpy.account.id,
      sessionId: showSessionByAccessTokenSpy.session.id
    }))
  })
})
