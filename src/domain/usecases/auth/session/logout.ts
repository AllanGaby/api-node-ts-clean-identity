export interface LogoutDTO {
  session_id: string
}

export interface Logout {
  logout: (params: LogoutDTO) => Promise<void>
}
