import { DbListAccessProfile } from './list-access-profile'
import { ListAccessProfileRepositorySpy, mockListAccessProfileFilter, throwError } from '@/data/test'

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

  test('Should throw if ListAccessProfileRepository throws', async () => {
    const { sut, listAccessProfileRepositorySpy } = makeSut()
    jest.spyOn(listAccessProfileRepositorySpy, 'listByFilter').mockImplementationOnce(throwError)
    const promise = sut.list(mockListAccessProfileFilter())
    await expect(promise).rejects.toThrow()
  })
})
