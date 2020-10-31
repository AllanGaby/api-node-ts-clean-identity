import { AccessProfileModel } from '@/domain/models/auth'
import faker from 'faker'

export const MockAccessProfileModel = (): AccessProfileModel => ({
  accessProfileId: faker.random.uuid(),
  title: faker.random.words(),
  listAccount: false

})
