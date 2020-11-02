import { MemoryAccessProfileRepository } from './access-profile'
import { AccessProfileModel } from '@/domain/models/auth'
import { mockCreateAccessProfileDTO, mockUpdateAccessProfileModel } from '@/data/test'
import { CreateAccessProfileDTO } from '@/domain/usecases/auth/access-profile'
import faker from 'faker'

interface sutTypes {
  sut: MemoryAccessProfileRepository
  createParams: CreateAccessProfileDTO
}

const makeSut = (): sutTypes => {
  const createParams = mockCreateAccessProfileDTO()
  const sut = new MemoryAccessProfileRepository()
  return {
    sut,
    createParams
  }
}

const checkCreatedAccessProfile = (accessProfile: AccessProfileModel, params: CreateAccessProfileDTO): void => {
  expect(accessProfile.id).toBeTruthy()
  expect(accessProfile.title).toBe(params.title)
  expect(accessProfile.listAccount).toBe(params.listAccount)
}

describe('MemoryAccessProfileRepository Create Method', () => {
  test('Should create an AccessProfile with correct value', async () => {
    const { sut, createParams } = makeSut()
    const createdAccessProfile = await sut.create(createParams)
    checkCreatedAccessProfile(createdAccessProfile, createParams)
  })
})

describe('MemoryAccessProfileRepository GetAccessProfileByTitle Method', () => {
  test('Should return null if AccessProfile not found', async () => {
    const { sut } = makeSut()
    const accessProfile = await sut.getAccessProfileByTitle(faker.random.words())
    expect(accessProfile).toBeFalsy()
  })

  test('Should return an AccessProfile with AccessProfile found', async () => {
    const { sut, createParams } = makeSut()
    const createdAccessProfile = await sut.create(createParams)
    const accessProfile = await sut.getAccessProfileByTitle(createdAccessProfile.title)
    expect(accessProfile).toEqual(createdAccessProfile)
  })
})

describe('MemoryAccessProfileRepository GetAccessProfileById Method', () => {
  test('Should return null if AccessProfile not found', async () => {
    const { sut } = makeSut()
    const accessProfile = await sut.getAccessProfileById(faker.random.uuid())
    expect(accessProfile).toBeFalsy()
  })

  test('Should return an AccessProfile with AccessProfile found', async () => {
    const { sut, createParams } = makeSut()
    const createdAccessProfile = await sut.create(createParams)
    const accessProfile = await sut.getAccessProfileById(createdAccessProfile.id)
    expect(accessProfile).toEqual(createdAccessProfile)
  })
})

describe('MemoryAccessProfileRepository ListByFilter Method', () => {
  test('Should return null if AccessProfile not found', async () => {
    const { sut } = makeSut()
    const list = await sut.listByFilter({ title: faker.random.words() })
    expect(list).toHaveLength(0)
  })

  test('Should return a list of AccessProfile with AccessProfile found', async () => {
    const { sut, createParams } = makeSut()
    await sut.create(createParams)
    await sut.create(createParams)
    await sut.create(createParams)
    const list = await sut.listByFilter({ title: createParams.title })
    expect(list).toHaveLength(3)
  })
})

describe('MemoryAccessProfileRepository Update Method', () => {
  test('Should return null if account not found', async () => {
    const { sut } = makeSut()
    const updateAccount = await sut.update(mockUpdateAccessProfileModel())
    expect(updateAccount).toBeFalsy()
  })

  test('Should return an updated account if account if found', async () => {
    const { sut, createParams } = makeSut()
    const updateParams = mockUpdateAccessProfileModel()
    const createdAccount = await sut.create(createParams)
    updateParams.id = createdAccount.id
    const updatedAccount = await sut.update(updateParams)
    expect(updatedAccount.id).toBe(updateParams.id)
    expect(updatedAccount.title).toBe(updateParams.title)
    expect(updatedAccount.listAccount).toBe(updateParams.listAccount)
    expect(updatedAccount.created_at).toBe(createdAccount.created_at)
    expect(updatedAccount.updated_at).not.toBe(createdAccount.updated_at)
  })
})
