import { AccountAccessiesModel } from '@/domain/models/auth'
import { ShowAccountAccessiesFilter } from '@/domain/usecases/auth/account-accessies'
import faker from 'faker'

export const mockAccountAccessiesModel = (): AccountAccessiesModel => ({
  accountId: faker.random.uuid(),
  listAccount: false
})

export const mockShowAccountAccessiesFilter = (): ShowAccountAccessiesFilter => ({
  accountId: faker.random.uuid()
})
