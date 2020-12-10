export enum SessionType {
  activeAccount = 1,
  authentication = 2,
  recoverPassword = 3
}

export interface SessionModel {
  id: string
  type: SessionType
  account_id: string
  deleted_at?: Date
  experied_at: Date
  created_at: Date
  updated_at: Date
}
