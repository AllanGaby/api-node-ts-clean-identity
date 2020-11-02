import { DbUpdateAccessProfile } from './update-access-profile'
import { GetAccessProfileByIdRepositorySpy, mockUpdateAccessProfileModel, throwError, UpdateAccessProfileRepositorySpy } from '@/data/test'

interface sutTypes {
  sut: DbUpdateAccessProfile
  getAccessProfileByIdRepositorySpy: GetAccessProfileByIdRepositorySpy
  updateAccessProfileRepositorySpy: UpdateAccessProfileRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccessProfileByIdRepositorySpy = new GetAccessProfileByIdRepositorySpy()
  const updateAccessProfileRepositorySpy = new UpdateAccessProfileRepositorySpy()
  const sut = new DbUpdateAccessProfile(getAccessProfileByIdRepositorySpy, updateAccessProfileRepositorySpy)
  return {
    sut,
    getAccessProfileByIdRepositorySpy,
    updateAccessProfileRepositorySpy
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

  test('Should call UpdateAccessProfileRepository with correct value', async () => {
    const { sut, updateAccessProfileRepositorySpy } = makeSut()
    const updateAccessProfileModel = mockUpdateAccessProfileModel()
    await sut.update(updateAccessProfileModel)
    expect(updateAccessProfileRepositorySpy.params).toEqual(updateAccessProfileModel)
  })

  test('Should throw if UpdateAccessProfileRepository throws', async () => {
    const { sut, updateAccessProfileRepositorySpy } = makeSut()
    jest.spyOn(updateAccessProfileRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccessProfileModel())
    await expect(promise).rejects.toThrow()
  })
})
