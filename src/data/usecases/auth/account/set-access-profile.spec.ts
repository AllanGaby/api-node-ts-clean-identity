import { DbSetAccessProfile } from './set-access-profile'
import { GetAccountByIdRepositorySpy, mockSetAccessProfileDTO } from '@/data/test'

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
})
