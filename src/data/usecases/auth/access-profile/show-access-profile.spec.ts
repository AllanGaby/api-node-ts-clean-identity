import { DbShowAccessProfile } from './show-access-profile'
import { GetAccessProfileByIdRepositorySpy } from '@/data/test'
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
})
