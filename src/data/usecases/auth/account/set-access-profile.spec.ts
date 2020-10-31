import { DbSetAccessProfile } from './set-access-profile'
import { GetAccountByIdRepositorySpy, mockSetAccessProfileDTO, UpdateAccountRepositorySpy, throwError } from '@/data/test'

interface sutTypes {
  sut: DbSetAccessProfile
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const sut = new DbSetAccessProfile(getAccountByIdRepositorySpy, updateAccountRepositorySpy)
  return {
    sut,
    getAccountByIdRepositorySpy,
    updateAccountRepositorySpy
  }
}

describe('DbSetAccessProfile', () => {
  test('Should call GetAccountByIdRepository with correct value', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    const setAccessProfileDTO = mockSetAccessProfileDTO()
    await sut.setAccessProfile(setAccessProfileDTO)
    expect(getAccountByIdRepositorySpy.accountId).toEqual(setAccessProfileDTO.accountId)
  })

  test('Should throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.setAccessProfile(mockSetAccessProfileDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByIdRepository return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const account = await sut.setAccessProfile(mockSetAccessProfileDTO())
    expect(account).toBeFalsy()
  })

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, updateAccountRepositorySpy, getAccountByIdRepositorySpy } = makeSut()
    const { account } = getAccountByIdRepositorySpy
    const setAccessProfileDTO = mockSetAccessProfileDTO()
    await sut.setAccessProfile(setAccessProfileDTO)
    expect(updateAccountRepositorySpy.params).toEqual({
      id: account.id,
      name: account.name,
      email: account.email,
      password: account.password,
      email_valided: account.email_valided,
      accessProfileId: setAccessProfileDTO.accessProfileId
    })
  })
})
