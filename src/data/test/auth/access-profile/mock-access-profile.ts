import { AccessProfileModel } from '@/domain/models/auth'
import { CreateAccessProfileDTO } from '@/domain/usecases/auth/access-profile'
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
