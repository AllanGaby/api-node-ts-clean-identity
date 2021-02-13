export interface AuthenticationModel {
  access_token: string
  account: {
    id: string
    name: string
    avatar_id: string
  }
}
