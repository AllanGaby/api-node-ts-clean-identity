import { DbUpdateAccessProfile } from './update-access-profile'
import { GetAccessProfileByIdRepositorySpy, mockUpdateAccessProfileModel } from '@/data/test'

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
})
