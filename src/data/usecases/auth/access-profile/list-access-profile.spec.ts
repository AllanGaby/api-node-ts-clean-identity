import { DbListAccessProfile } from './list-access-profile'
import { ListAccessProfileRepositorySpy, mockListAccessProfileFilter } from '@/data/test'

interface sutTypes {
  sut: DbListAccessProfile
  listAccessProfileRepositorySpy: ListAccessProfileRepositorySpy
}

const makeSut = (): sutTypes => {
  const listAccessProfileRepositorySpy = new ListAccessProfileRepositorySpy()
  const sut = new DbListAccessProfile(listAccessProfileRepositorySpy)
  return {
    sut,
    listAccessProfileRepositorySpy
  }
}

describe('DbListAccessProfile', () => {
  test('Should call ListAccessProfileRepository with correct value', async () => {
    const { sut, listAccessProfileRepositorySpy } = makeSut()
    const filter = mockListAccessProfileFilter()
    await sut.list(filter)
    expect(listAccessProfileRepositorySpy.params).toEqual(filter)
  })
})
