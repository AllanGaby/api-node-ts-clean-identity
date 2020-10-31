import { DbShowAccessProfile } from './show-access-profile'
import { GetAccessProfileByIdRepositorySpy, mockAccessProfileModel, throwError } from '@/data/test'
import faker from 'faker'

interface sutTypes {
  sut: DbShowAccessProfile
  getAccessProfileByIdRepositorySpy: GetAccessProfileByIdRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccessProfileByIdRepositorySpy = new GetAccessProfileByIdRepositorySpy()
  const sut = new DbShowAccessProfile(getAccessProfileByIdRepositorySpy)
  return {
    sut,
    getAccessProfileByIdRepositorySpy
  }
}

describe('DbShowAccessProfile', () => {
  test('Should call GetAccessProfileByIdRepository with correct id', async () => {
    const { sut, getAccessProfileByIdRepositorySpy } = makeSut()
    const id = faker.random.uuid()
    await sut.show(id)
    expect(getAccessProfileByIdRepositorySpy.params).toEqual(id)
  })

  test('Should throw if GetAccessProfileByIdRepository throws', async () => {
    const { sut, getAccessProfileByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccessProfileByIdRepositorySpy, 'getAccessProfileById').mockImplementationOnce(throwError)
    const promise = sut.show(faker.random.uuid())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccessProfileByIdRepository return null', async () => {
    const { sut, getAccessProfileByIdRepositorySpy } = makeSut()
    getAccessProfileByIdRepositorySpy.accessProfile = null
    const accessProfile = await sut.show(faker.random.uuid())
    expect(accessProfile).toBeFalsy()
  })

  test('Should return AccessProfile if GetAccessProfileByIdRepository return an AccessProfile', async () => {
    const { sut, getAccessProfileByIdRepositorySpy } = makeSut()
    getAccessProfileByIdRepositorySpy.accessProfile = mockAccessProfileModel()
    const accessProfile = await sut.show(faker.random.uuid())
    expect(accessProfile.id).toBeTruthy()
    expect(accessProfile.title).toEqual(getAccessProfileByIdRepositorySpy.accessProfile.title)
    expect(accessProfile.listAccount).toEqual(getAccessProfileByIdRepositorySpy.accessProfile.listAccount)
  })
})
