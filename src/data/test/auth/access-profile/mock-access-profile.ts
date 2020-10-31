import { AccessProfileModel } from '@/domain/models/auth'
import { CreateAccessProfileDTO, ListAccessProfileFilter } from '@/domain/usecases/auth/access-profile'
import faker from 'faker'

export const mockAccessProfileModel = (): AccessProfileModel => ({
  id: faker.random.uuid(),
  title: faker.random.words(),
  listAccount: false
})

export const mockCreateAccessProfileDTO = (): CreateAccessProfileDTO => ({
  title: faker.random.words(),
  listAccount: false
})

export const mockListAccessProfileFilter = (): ListAccessProfileFilter => ({
  title: faker.random.words()
})
