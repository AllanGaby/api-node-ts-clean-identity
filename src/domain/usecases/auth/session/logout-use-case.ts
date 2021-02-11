export interface LogoutDTO {
  sessionId: string
}

export interface LogoutUseCase {
  logout: (params: LogoutDTO) => Promise<void>
}
