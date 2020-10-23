export interface AuthenticationAccountDTO {
  email: string
  password: string
}

export interface AuthenticationAccount {
  authenticate: (data: AuthenticationAccountDTO) => Promise<string>
}
