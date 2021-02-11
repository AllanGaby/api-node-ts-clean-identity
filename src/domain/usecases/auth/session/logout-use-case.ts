export interface LogoutDTO {
  sessionId: string
}

export interface Logout {
  logout: (params: LogoutDTO) => Promise<void>
}
