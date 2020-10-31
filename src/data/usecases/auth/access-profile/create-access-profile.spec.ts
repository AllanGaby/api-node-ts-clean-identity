import { DbCreateAccessProfile } from './create-access-profile'
import { GetAccessProfileByTitleRepositorySpy, MockAccessProfileModel, throwError } from '@/data/test'

interface sutTypes {
  sut: DbCreateAccessProfile
  getAccessProfileByTitleRepositorySpy: GetAccessProfileByTitleRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccessProfileByTitleRepositorySpy = new GetAccessProfileByTitleRepositorySpy()
  const sut = new DbCreateAccessProfile(getAccessProfileByTitleRepositorySpy)
  return {
    sut,
    getAccessProfileByTitleRepositorySpy
  }
}

describe('DbCreateAccessProfile', () => {
  test('Should call GetAccessProfileByTitleRepository with correct title', async () => {
    const { sut, getAccessProfileByTitleRepositorySpy } = makeSut()
    const accessProfile = MockAccessProfileModel()
    await sut.create(accessProfile)
    expect(getAccessProfileByTitleRepositorySpy.title).toBe(accessProfile.title)
  })

  test('Should throw if GetAccessProfileByTitleRepository throws', async () => {
    const { sut, getAccessProfileByTitleRepositorySpy } = makeSut()
    jest.spyOn(getAccessProfileByTitleRepositorySpy, 'getAccessProfileByTitle').mockImplementationOnce(throwError)
    const promise = sut.create(MockAccessProfileModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccessProfileByTitleRepository return any AccessProfileModel', async () => {
    const { sut } = makeSut()
    const accessProfile = await sut.create(MockAccessProfileModel())
    expect(accessProfile).toBeFalsy()
  })
})
