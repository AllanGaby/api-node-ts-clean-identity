import { ShowAccountBySessionController } from './show-account-by-session-controller'
import { ShowAccountSpy, mockShowAccountRequest } from '@/presentation/test/auth'
import { serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/test'

interface sutTypes {
  sut: ShowAccountBySessionController
  showAccountSpy: ShowAccountSpy
}

const makeSut = (): sutTypes => {
  const showAccountSpy = new ShowAccountSpy()
  const sut = new ShowAccountBySessionController(showAccountSpy)
  return {
    sut,
    showAccountSpy
  }
}

describe('ShowAccountBySessionController', () => {
  test('Should call ShowAccount with correct values', async () => {
    const { sut, showAccountSpy } = makeSut()
    const request = mockShowAccountRequest()
    await sut.handle(request)
    expect(showAccountSpy.params).toEqual({
      accountId: request.body.id
    })
  })

  test('Should return ServerError if ShowAccount throws', async () => {
    const { sut, showAccountSpy } = makeSut()
    jest.spyOn(showAccountSpy, 'show').mockImplementationOnce(throwError)
    const result = await sut.handle(mockShowAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return ok and updated account if succeeds', async () => {
    const { sut, showAccountSpy } = makeSut()
    const result = await sut.handle(mockShowAccountRequest())
    expect(result).toEqual(ok(showAccountSpy.account))
  })
})