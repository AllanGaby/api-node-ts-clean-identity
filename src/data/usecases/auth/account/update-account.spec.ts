import { DbUpdateAccount } from './update-account'
import { GetAccountByIdRepositorySpy, UpdateAccountRepositorySpy } from '@/data/test/auth/mock-account-repository'
import { mockUpdateAccountDTO, throwError } from '@/data/test'
import { HasherSpy } from '@/data/test/mock-criptography'

interface sutTypes {
  sut: DbUpdateAccount
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
  hasherSpy: HasherSpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
}

const makeSut = (): sutTypes => {
  const hasherSpy = new HasherSpy()
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const sut = new DbUpdateAccount(getAccountByIdRepositorySpy, hasherSpy, updateAccountRepositorySpy)
  return {
    sut,
    getAccountByIdRepositorySpy,
    hasherSpy,
    updateAccountRepositorySpy
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

  test('Should not call Hasher if not change password', async () => {
    const { sut, hasherSpy } = makeSut()
    const createHashSpy = jest.spyOn(hasherSpy, 'createHash')
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.password
    await sut.update(updateAccountDTO)
    expect(createHashSpy).not.toBeCalled()
  })

  test('Should call Hasher with correct values if change password', async () => {
    const { sut, hasherSpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(hasherSpy.payload).toBe(updateAccountDTO.password)
  })

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, hasherSpy, getAccountByIdRepositorySpy, updateAccountRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(updateAccountRepositorySpy.account.id).toBe(getAccountByIdRepositorySpy.account.id)
    expect(updateAccountRepositorySpy.account.name).toBe(updateAccountDTO.name)
    expect(updateAccountRepositorySpy.account.email).toBe(updateAccountDTO.email)
    expect(updateAccountRepositorySpy.account.password).toBe(hasherSpy.hash)
  })
})
