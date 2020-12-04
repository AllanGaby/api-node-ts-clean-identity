import { AuthenticationMiddleware } from './authentication-middleware'
import { ShowAccountBySessionSpy, mockAuthenticationRequest, mockAuthenticationFailRequest, ShowSessionByAccessTokenSpy } from '@/presentation/test/auth'
import { AccountType, SessionType } from '@/domain/models/auth'
import { badRequest, forbidden, serverError, ok } from '@/presentation/helpers'
import { MissingParamError } from '@/validation/errors'
import { throwError } from '@/data/test'
import { AccessDeniedError } from '@/presentation/errors'

interface sutTypes {
  sut: AuthenticationMiddleware
  showSessionByAccessTokenSpy: ShowSessionByAccessTokenSpy
  showAccountBySessionSpy: ShowAccountBySessionSpy
}

const makeSut = (accountType: AccountType[] = [AccountType.student]): sutTypes => {
  const showSessionByAccessTokenSpy = new ShowSessionByAccessTokenSpy()
  const showAccountBySessionSpy = new ShowAccountBySessionSpy()
  let sut: AuthenticationMiddleware
  if (!accountType) {
    sut = new AuthenticationMiddleware(showSessionByAccessTokenSpy, showAccountBySessionSpy)
  } else {
    sut = new AuthenticationMiddleware(showSessionByAccessTokenSpy, showAccountBySessionSpy, accountType)
  }
  return {
    sut,
    showSessionByAccessTokenSpy,
    showAccountBySessionSpy
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

  test('Should call ShowAccountBySession with correct value', async () => {
    const { sut, showAccountBySessionSpy } = makeSut()
    const request = mockAuthenticationRequest()
    await sut.handle(request)
    expect(showAccountBySessionSpy.params).toEqual({
      accessToken: request.headers?.['x-access-token']
    })
  })

  test('Should return ServerError if ShowAccountBySession throws', async () => {
    const { sut, showAccountBySessionSpy } = makeSut()
    jest.spyOn(showAccountBySessionSpy, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return Forbidden if account is not found', async () => {
    const { sut, showAccountBySessionSpy } = makeSut()
    showAccountBySessionSpy.account = null
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return Forbidden if account type is different', async () => {
    const { sut, showAccountBySessionSpy } = makeSut([AccountType.manager])
    showAccountBySessionSpy.account.type = AccountType.student
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return an Account if succeeds', async () => {
    const { sut, showAccountBySessionSpy } = makeSut()
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(ok(showAccountBySessionSpy.account))
  })

  test('Should return an Account if succeeds without accounttype check', async () => {
    const { sut, showAccountBySessionSpy } = makeSut(null)
    const result = await sut.handle(mockAuthenticationRequest())
    expect(result).toEqual(ok(showAccountBySessionSpy.account))
  })
})
