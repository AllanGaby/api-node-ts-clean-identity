export enum SessionType {
  activeAccount
}

export interface SessionModel {
  id: string
  type: SessionType
  accountId: string
  deleted_at: Date
  experied_at: Date
  created_at: Date
  update_at: Date
}
