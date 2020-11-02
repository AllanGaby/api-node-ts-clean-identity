import { AccessProfileModel } from '@/domain/models/auth'
import { CreateAccessProfileDTO, ListAccessProfileFilter, UpdateAccessProfileModel } from '@/domain/usecases/auth/access-profile'
import faker from 'faker'

export const mockAccessProfileModel = (): AccessProfileModel => ({
  id: faker.random.uuid(),
  title: faker.random.words(),
  listAccount: false,
  created_at: new Date(),
  updated_at: new Date()
})

export const mockCreateAccessProfileDTO = (): CreateAccessProfileDTO => ({
  title: faker.random.words(),
  listAccount: false
})

export const mockUpdateAccessProfileModel = (): UpdateAccessProfileModel => ({
  id: faker.random.uuid(),
  title: faker.random.words(),
  listAccount: false
})

export const mockListAccessProfileFilter = (): ListAccessProfileFilter => ({
  title: faker.random.words()
})
