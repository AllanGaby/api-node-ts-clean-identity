export interface RequestRecoverPasswordDTO {
  email: string
}

export interface RequestRecoverPassword {
  request: (data: RequestRecoverPasswordDTO) => Promise<boolean>
}
