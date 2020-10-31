import { DbListAccessProfile } from './list-access-profile'
import { ListAccessProfileRepositorySpy, mockAccessProfileModel, mockListAccessProfileFilter, throwError } from '@/data/test'

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

  test('Should return null if ListAccessProfileRepository return null', async () => {
    const { sut, listAccessProfileRepositorySpy } = makeSut()
    listAccessProfileRepositorySpy.accessProfileList = null
    const accessProfileList = await sut.list(mockListAccessProfileFilter())
    expect(accessProfileList).toBeFalsy()
  })

  test('Should return null if ListAccessProfileRepository return null', async () => {
    const { sut, listAccessProfileRepositorySpy } = makeSut()
    listAccessProfileRepositorySpy.accessProfileList = [
      mockAccessProfileModel(),
      mockAccessProfileModel()
    ]
    const accessProfileList = await sut.list(mockListAccessProfileFilter())
    expect(accessProfileList).toHaveLength(2)
  })
})
