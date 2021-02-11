import { AuthenticationMiddleware } from './authentication-middleware'
import { ShowAccountSpy, mockAuthenticationRequest, mockAuthenticationFailRequest, ShowSessionByAccessTokenSpy } from '@/presentation/test/auth'
import { SessionType } from '@/domain/models/auth'
import { badRequest, serverError, ok, unauthorized } from '@/presentation/helpers'
import { MissingParamError } from '@/validation/errors'
import { throwError } from '@/data/test'
import { AccessDeniedError } from '@/presentation/errors'
import faker from 'faker'

interface sutTypes {
  sut: AuthenticationMiddleware
  tokenName: string
  showSessionByAccessTokenSpy: ShowSessionByAccessTokenSpy
  showAccountSpy: ShowAccountSpy
}

const makeSut = (): sutTypes => {
  const tokenName = faker.random.uuid()
  const showSessionByAccessTokenSpy = new ShowSessionByAccessTokenSpy()
  const showAccountSpy = new ShowAccountSpy()
  const sut = new AuthenticationMiddleware(tokenName, showSessionByAccessTokenSpy, showAccountSpy)
  return {
    sut,
    tokenName,
    showSessionByAccessTokenSpy,
    showAccountSpy
  }
}

describe('AuthenticationMiddleware', () => {
  test('Should return BadRequest token not found', async () => {
    const { sut, tokenName } = makeSut()
    const result = await sut.handle(mockAuthenticationFailRequest())
    expect(result).toEqual(badRequest(new MissingParamError(tokenName)))
  })

  test('Should return BadRequest if request headers not found', async () => {
    const { sut, tokenName } = makeSut()
    const result = await sut.handle({})
    expect(result).toEqual(badRequest(new MissingParamError(tokenName)))
  })

  test('Should call ShowSessiontByAccessToken with correct value', async () => {
    const { sut, showSessionByAccessTokenSpy, tokenName } = makeSut()
    const request = mockAuthenticationRequest(tokenName)
    await sut.handle(request)
    expect(showSessionByAccessTokenSpy.params).toEqual({
      accessToken: request.headers[tokenName]
    })
  })

  test('Should return ServerError if ShowSessiontByAccessToken throws', async () => {
    const { sut, showSessionByAccessTokenSpy, tokenName } = makeSut()
    jest.spyOn(showSessionByAccessTokenSpy, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockAuthenticationRequest(tokenName))
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Forbidden if session is not found', async () => {
    const { sut, showSessionByAccessTokenSpy, tokenName } = makeSut()
    showSessionByAccessTokenSpy.session = null
    const result = await sut.handle(mockAuthenticationRequest(tokenName))
    expect(result).toEqual(unauthorized(new AccessDeniedError()))
  })

  test('Should return Forbidden if account type is different of authentication', async () => {
    const { sut, showSessionByAccessTokenSpy, tokenName } = makeSut()
    showSessionByAccessTokenSpy.session.type = SessionType.activeAccount
    const result = await sut.handle(mockAuthenticationRequest(tokenName))
    expect(result).toEqual(unauthorized(new AccessDeniedError()))
  })

  test('Should call ShowAccount with correct value', async () => {
    const { sut, showAccountSpy, showSessionByAccessTokenSpy, tokenName } = makeSut()
    const request = mockAuthenticationRequest(tokenName)
    await sut.handle(request)
    expect(showAccountSpy.params.accountId).toEqual(showSessionByAccessTokenSpy.session.account_id)
  })

  test('Should return ServerError if ShowAccount throws', async () => {
    const { sut, showAccountSpy, tokenName } = makeSut()
    jest.spyOn(showAccountSpy, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockAuthenticationRequest(tokenName))
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Forbidden if account is not found', async () => {
    const { sut, showAccountSpy, tokenName } = makeSut()
    showAccountSpy.account = null
    const result = await sut.handle(mockAuthenticationRequest(tokenName))
    expect(result).toEqual(unauthorized(new AccessDeniedError()))
  })

  test('Should return an Account if succeeds', async () => {
    const { sut, showAccountSpy, showSessionByAccessTokenSpy, tokenName } = makeSut()
    const result = await sut.handle(mockAuthenticationRequest(tokenName))
    expect(result).toEqual(ok({
      accountId: showAccountSpy.account.id,
      sessionId: showSessionByAccessTokenSpy.session.id
    }))
  })
})
