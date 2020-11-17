import { ListAccountController } from './list-account'
import { ListAccountSpy, mockListAccountRequest } from '@/presentation/test/auth'
import { throwError } from '@/data/test'
import { serverError } from '@/presentation/helpers'

interface sutTypes {
  sut: ListAccountController
  listAccountSpy: ListAccountSpy
}

const makeSut = (): sutTypes => {
  const listAccountSpy = new ListAccountSpy()
  const sut = new ListAccountController(listAccountSpy)
  return {
    sut,
    listAccountSpy
  }
}

describe('ListAccountController', () => {
  test('Should call ListAccount with correct values', async () => {
    const { sut, listAccountSpy } = makeSut()
    const request = mockListAccountRequest()
    await sut.handle(request)
    expect(listAccountSpy.params).toEqual(request.body)
  })

  test('Should return ServerError if ListAccount throws', async () => {
    const { sut, listAccountSpy } = makeSut()
    jest.spyOn(listAccountSpy, 'list').mockImplementationOnce(throwError)
    const result = await sut.handle(mockListAccountRequest())
    expect(result).toEqual(serverError(new Error('')))
  })
})
