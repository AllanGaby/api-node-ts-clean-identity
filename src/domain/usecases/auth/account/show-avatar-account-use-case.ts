export interface ShowAvatarAccountDTO {
  accountId: string
}

export interface ShowAvatarAccountUseCase {
  show: (data: ShowAvatarAccountDTO) => Promise<string>
}
