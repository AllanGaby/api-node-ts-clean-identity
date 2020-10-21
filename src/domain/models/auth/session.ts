export enum SessionType {
  activeAccount,
  authentication,
  recoverPassword
}

export interface SessionModel {
  id: string
  type: SessionType
  accountId: string
  deleted_at?: Date
  experied_at: Date
  created_at: Date
  updated_at: Date
}
