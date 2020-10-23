import { DbSetAccountAccessies } from './set-account-accessies'
import { GetAccountAccessiesByAccountIdRepositorySpy, mockAccountAccessiesModel, throwError, CreateAccountAccessiesRepositorySpy, UpdateAccountAccessiesRepositorySpy } from '@/data/test'

interface sutTypes {
  sut: DbSetAccountAccessies
  getAccountAccessiesByAccountIdRepositorySpy: GetAccountAccessiesByAccountIdRepositorySpy
  createAccountAccessiesRepositorySpy: CreateAccountAccessiesRepositorySpy
  updateAccountAccessiesRepositorySpy: UpdateAccountAccessiesRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountAccessiesByAccountIdRepositorySpy = new GetAccountAccessiesByAccountIdRepositorySpy()
  const createAccountAccessiesRepositorySpy = new CreateAccountAccessiesRepositorySpy()
  const updateAccountAccessiesRepositorySpy = new UpdateAccountAccessiesRepositorySpy()
  const sut = new DbSetAccountAccessies(getAccountAccessiesByAccountIdRepositorySpy, createAccountAccessiesRepositorySpy, updateAccountAccessiesRepositorySpy)
  return {
    sut,
    getAccountAccessiesByAccountIdRepositorySpy,
    createAccountAccessiesRepositorySpy,
    updateAccountAccessiesRepositorySpy
  }
}

describe('DbSetAccountAccessies', () => {
  test('Should call GetAccountAccessiesByAccountIdRepository with correct value', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy } = makeSut()
    const accountAccessies = mockAccountAccessiesModel()
    await sut.set(accountAccessies)
    expect(getAccountAccessiesByAccountIdRepositorySpy.accountId).toBe(accountAccessies.accountId)
  })

  test('Should throw if GetAccountAccessiesByAccountIdRepository throws', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountAccessiesByAccountIdRepositorySpy, 'getAccountAccessiesByAccountId').mockImplementationOnce(throwError)
    const promise = sut.set(mockAccountAccessiesModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateAccountAccessiesByAccountIdRepository if GetAccountAccessiesByAccountIdRepository return null', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy, createAccountAccessiesRepositorySpy, updateAccountAccessiesRepositorySpy } = makeSut()
    const cresteSpy = jest.spyOn(createAccountAccessiesRepositorySpy, 'create')
    const updateSPy = jest.spyOn(updateAccountAccessiesRepositorySpy, 'update')
    getAccountAccessiesByAccountIdRepositorySpy.accountAccessies = null
    await sut.set(mockAccountAccessiesModel())
    expect(cresteSpy).toBeCalledTimes(1)
    expect(updateSPy).not.toBeCalled()
  })

  test('Should call CreateAccountAccessiesByAccountIdRepository with correct value', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy, createAccountAccessiesRepositorySpy } = makeSut()
    getAccountAccessiesByAccountIdRepositorySpy.accountAccessies = null
    const accountAccessies = mockAccountAccessiesModel()
    await sut.set(accountAccessies)
    expect(createAccountAccessiesRepositorySpy.accountAccessies).toEqual(accountAccessies)
  })

  test('Should throw if CreateAccountAccessiesByAccountIdRepository throw', async () => {
    const { sut, getAccountAccessiesByAccountIdRepositorySpy, createAccountAccessiesRepositorySpy } = makeSut()
    getAccountAccessiesByAccountIdRepositorySpy.accountAccessies = null
    jest.spyOn(createAccountAccessiesRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.set(mockAccountAccessiesModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccountAccessiesRepository if GetAccountAccessiesByAccountIdRepository return any accountAccessies', async () => {
    const { sut, createAccountAccessiesRepositorySpy, updateAccountAccessiesRepositorySpy } = makeSut()
    const cresteSpy = jest.spyOn(createAccountAccessiesRepositorySpy, 'create')
    const updateSPy = jest.spyOn(updateAccountAccessiesRepositorySpy, 'update')
    await sut.set(mockAccountAccessiesModel())
    expect(cresteSpy).not.toBeCalled()
    expect(updateSPy).toBeCalledTimes(1)
  })

  test('Should call UpdateAccountAccessiesRepository with correct value', async () => {
    const { sut, updateAccountAccessiesRepositorySpy } = makeSut()
    const accountAccessies = mockAccountAccessiesModel()
    await sut.set(accountAccessies)
    expect(updateAccountAccessiesRepositorySpy.accountAccessies).toBe(accountAccessies)
  })

  test('Should throw if UpdateAccountAccessiesRepository throw', async () => {
    const { sut, updateAccountAccessiesRepositorySpy } = makeSut()
    jest.spyOn(updateAccountAccessiesRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.set(mockAccountAccessiesModel())
    await expect(promise).rejects.toThrow()
  })
})
