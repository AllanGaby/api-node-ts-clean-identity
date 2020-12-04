import { DbGetFilenameToAccountAvatar } from './get-filename-to-account-avatar'
import { GetAccountByIdRepositorySpy, mockGetAvatarFilter } from '@/data/test/auth/account'
import { throwError } from '@/data/test'
import faker from 'faker'
import path from 'path'

interface sutTypes {
  sut: DbGetFilenameToAccountAvatar
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const sut = new DbGetFilenameToAccountAvatar(getAccountByIdRepositorySpy)
  return {
    sut,
    getAccountByIdRepositorySpy
  }
}

describe('DbGetFilenameToAccountAvatar', () => {
  test('Should call GetAccountByIdRepository with correct value', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    const filter = mockGetAvatarFilter()
    await sut.getPath(filter)
    expect(getAccountByIdRepositorySpy.accountId).toEqual(filter.accountId)
  })

  test('Should throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.getPath(mockGetAvatarFilter())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByIdRepository return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const accountAvatar = await sut.getPath(mockGetAvatarFilter())
    expect(accountAvatar).toBeFalsy()
  })

  test('Should return null if GetAccountByIdRepository if account without avatar', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account.avatar_extention = null
    const accountAvatar = await sut.getPath(mockGetAvatarFilter())
    expect(accountAvatar).toBeFalsy()
  })

  test('Should return correct avatar file if GetAccountByIdRepository return an account with avatar', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account.avatar_extention = faker.system.filePath()
    const filter = mockGetAvatarFilter()
    const accountAvatar = await sut.getPath(filter)
    expect(accountAvatar).toEqual({
      avatar_file_path: `${filter.uploadDir}${path.sep}${getAccountByIdRepositorySpy.account.id}${getAccountByIdRepositorySpy.account.avatar_extention}`
    })
  })
})
