export interface ComparerDTO {
  payload: string
  hashedText: string
}

export interface HashComparer {
  compare: (data: ComparerDTO) => Promise<boolean>
}
