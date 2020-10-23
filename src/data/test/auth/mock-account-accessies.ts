import { AccountAccessiesModel } from '@/domain/models/auth'
import faker from 'faker'

export const mockAccountAccessiesModel = (): AccountAccessiesModel => ({
  accountId: faker.random.uuid(),
  listAccount: false
})
