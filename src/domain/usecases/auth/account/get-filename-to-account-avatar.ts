export interface GetAvatarFilter {
  accountId: string
}

export interface GetFilenameToAccountAvatar {
  getPath: (filter: GetAvatarFilter) => Promise<string>
}
