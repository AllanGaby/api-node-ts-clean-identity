import { SessionType } from '@/domain/models/auth'

export interface MemorySessionModel {
  id: string
  type: SessionType
  accountId: string
  deleted_at?: Date
  experied_at: Date
  created_at: Date
  updated_at: Date
}
