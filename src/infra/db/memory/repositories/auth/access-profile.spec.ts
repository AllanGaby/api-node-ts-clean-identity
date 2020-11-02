import { MemoryAccessProfileRepository } from './access-profile'
import { AccessProfileModel } from '@/domain/models/auth'
import { mockCreateAccessProfileDTO } from '@/data/test'
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
