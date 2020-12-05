export class AccountNotFoundError extends Error {
  constructor () {
    super('Account not fould')
    this.name = 'AccountNotFoundError'
  }
}
