import { DbCreateAccessProfile } from './create-access-profile'
import { GetAccessProfileByTitleRepositorySpy, mockCreateAccessProfileDTO, throwError, CreateAccessProfileRepositorySpy } from '@/data/test'

interface sutTypes {
  sut: DbCreateAccessProfile
  getAccessProfileByTitleRepositorySpy: GetAccessProfileByTitleRepositorySpy
  createAccessProfileRepositorySpy: CreateAccessProfileRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccessProfileByTitleRepositorySpy = new GetAccessProfileByTitleRepositorySpy()
  const createAccessProfileRepositorySpy = new CreateAccessProfileRepositorySpy()
  const sut = new DbCreateAccessProfile(getAccessProfileByTitleRepositorySpy, createAccessProfileRepositorySpy)
  return {
    sut,
    getAccessProfileByTitleRepositorySpy,
    createAccessProfileRepositorySpy
  }
}

describe('DbCreateAccessProfile', () => {
  test('Should call GetAccessProfileByTitleRepository with correct title', async () => {
    const { sut, getAccessProfileByTitleRepositorySpy } = makeSut()
    getAccessProfileByTitleRepositorySpy.accessProfile = null
    const accessProfile = mockCreateAccessProfileDTO()
    await sut.create(accessProfile)
    expect(getAccessProfileByTitleRepositorySpy.title).toBe(accessProfile.title)
  })

  test('Should throw if GetAccessProfileByTitleRepository throws', async () => {
    const { sut, getAccessProfileByTitleRepositorySpy } = makeSut()
    jest.spyOn(getAccessProfileByTitleRepositorySpy, 'getAccessProfileByTitle').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateAccessProfileDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccessProfileByTitleRepository return any AccessProfileModel', async () => {
    const { sut, createAccessProfileRepositorySpy } = makeSut()
    const createSpy = jest.spyOn(createAccessProfileRepositorySpy, 'create')
    const promise = sut.create(mockCreateAccessProfileDTO())
    await expect(promise).rejects.toThrow()
    expect(createSpy).not.toBeCalled()
  })

  test('Should call CreateAccessProfileRepository with correct values', async () => {
    const { sut, getAccessProfileByTitleRepositorySpy, createAccessProfileRepositorySpy } = makeSut()
    getAccessProfileByTitleRepositorySpy.accessProfile = null
    const accessProfile = mockCreateAccessProfileDTO()
    await sut.create(accessProfile)
    expect(createAccessProfileRepositorySpy.params).toEqual(accessProfile)
  })

  test('Should throw if CreateAccessProfileRepository throws', async () => {
    const { sut, getAccessProfileByTitleRepositorySpy, createAccessProfileRepositorySpy } = makeSut()
    getAccessProfileByTitleRepositorySpy.accessProfile = null
    jest.spyOn(createAccessProfileRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateAccessProfileDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an AccessProfile if success', async () => {
    const { sut, getAccessProfileByTitleRepositorySpy, createAccessProfileRepositorySpy } = makeSut()
    getAccessProfileByTitleRepositorySpy.accessProfile = null
    const accessProfile = await sut.create(mockCreateAccessProfileDTO())
    expect(accessProfile).toEqual(createAccessProfileRepositorySpy.accessProfile)
  })
})
