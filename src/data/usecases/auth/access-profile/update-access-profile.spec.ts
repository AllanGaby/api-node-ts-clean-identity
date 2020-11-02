import { DbUpdateAccessProfile } from './update-access-profile'
import { GetAccessProfileByIdRepositorySpy, mockUpdateAccessProfileModel, throwError } from '@/data/test'

interface sutTypes {
  sut: DbUpdateAccessProfile
  getAccessProfileByIdRepositorySpy: GetAccessProfileByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccessProfileByIdRepositorySpy = new GetAccessProfileByIdRepositorySpy()
  const sut = new DbUpdateAccessProfile(getAccessProfileByIdRepositorySpy)
  return {
    sut,
    getAccessProfileByIdRepositorySpy
  }
}

describe('DbUpdateAccessProfile', () => {
  test('Should call GetAccessProfileByIdRepository with correct value', async () => {
    const { sut, getAccessProfileByIdRepositorySpy } = makeSut()
    const updateAccessProfile = mockUpdateAccessProfileModel()
    await sut.update(updateAccessProfile)
    expect(getAccessProfileByIdRepositorySpy.params).toBe(updateAccessProfile.id)
  })

  test('Should throw if GetAccessProfileByIdRepository throws', async () => {
    const { sut, getAccessProfileByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccessProfileByIdRepositorySpy, 'getAccessProfileById').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccessProfileModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if GetAccessProfileByIdRepository return null', async () => {
    const { sut, getAccessProfileByIdRepositorySpy } = makeSut()
    getAccessProfileByIdRepositorySpy.accessProfile = null
    const promise = sut.update(mockUpdateAccessProfileModel())
    await expect(promise).rejects.toThrow()
  })
})
