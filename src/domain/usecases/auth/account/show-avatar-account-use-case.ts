export interface ShowAvatarAccountDTO {
  fileId: string
}

export interface ShowAvatarAccountUseCase {
  show: (data: ShowAvatarAccountDTO) => Promise<string>
}
