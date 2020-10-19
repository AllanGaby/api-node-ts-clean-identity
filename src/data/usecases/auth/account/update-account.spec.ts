import { DbUpdateAccount } from './update-account'
import { GetAccountByIdRepositorySpy } from '@/data/test/auth/mock-account-repository'
import { mockUpdateAccountDTO, throwError } from '@/data/test'

interface sutTypes {
  sut: DbUpdateAccount
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const sut = new DbUpdateAccount(getAccountByIdRepositorySpy)
  return {
    sut,
    getAccountByIdRepositorySpy
  }
}

describe('DbUpdateAccount', () => {
  test('Should call GetAccountByIdRepostirory with correct values', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(getAccountByIdRepositorySpy.accountId).toBe(updateAccountDTO.id)
  })

  test('Should return null if GetAccountByIdRepostirory return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const account = await sut.update(mockUpdateAccountDTO())
    expect(account).toBeFalsy()
  })

  test('Should throw if GetAccountByIdRepostirory throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})
