import { DbSetAccessProfile } from './set-access-profile'
import { GetAccountByIdRepositorySpy, mockSetAccessProfileDTO, throwError } from '@/data/test'

interface sutTypes {
  sut: DbSetAccessProfile
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const sut = new DbSetAccessProfile(getAccountByIdRepositorySpy)
  return {
    sut,
    getAccountByIdRepositorySpy
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
})
