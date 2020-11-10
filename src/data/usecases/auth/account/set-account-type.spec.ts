import { DbSetAccountType } from './set-account-type'
import { GetAccountByIdRepositorySpy, mockSetAccountTypeDTO, UpdateAccountRepositorySpy, throwError } from '@/data/test'

interface sutTypes {
  sut: DbSetAccountType
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const sut = new DbSetAccountType(getAccountByIdRepositorySpy, updateAccountRepositorySpy)
  return {
    sut,
    getAccountByIdRepositorySpy,
    updateAccountRepositorySpy
  }
}

describe('DbSetAccountType', () => {
  test('Should call GetAccountByIdRepository with correct value', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    const setAccessProfileDTO = mockSetAccountTypeDTO()
    await sut.setAccountType(setAccessProfileDTO)
    expect(getAccountByIdRepositorySpy.accountId).toEqual(setAccessProfileDTO.accountId)
  })

  test('Should throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.setAccountType(mockSetAccountTypeDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByIdRepository return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const promise = sut.setAccountType(mockSetAccountTypeDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, updateAccountRepositorySpy, getAccountByIdRepositorySpy } = makeSut()
    const { account } = getAccountByIdRepositorySpy
    const setAccountTypeDTO = mockSetAccountTypeDTO()
    await sut.setAccountType(setAccountTypeDTO)
    expect(updateAccountRepositorySpy.params).toEqual({
      id: account.id,
      name: account.name,
      email: account.email,
      password: account.password,
      email_valided: account.email_valided,
      type: setAccountTypeDTO.accountType
    })
  })

  test('Should throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    jest.spyOn(updateAccountRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.setAccountType(mockSetAccountTypeDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an updated account if success', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    const updatedAccount = await sut.setAccountType(mockSetAccountTypeDTO())
    expect(updatedAccount).toEqual(updateAccountRepositorySpy.account)
  })
})
