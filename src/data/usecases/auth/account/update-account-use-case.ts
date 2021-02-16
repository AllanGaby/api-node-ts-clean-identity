import { AccountNotFoundError, InvalidCredentialsError } from '@/data/errors'
import { CacheRemoveByPrefix, CacheRemove } from '@/data/protocols/cache'
import { HashComparer, HashCreator } from '@/data/protocols/criptography'
import { GetAccountByIdRepository, UpdateAccountRepository, DeleteSessionByAccountIdRepository } from '@/data/repositories/auth'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { UpdateAccountUseCase, UpdateAccountDTO } from '@/domain/usecases/auth/account'
import { SendMailSessionUseCase } from '@/domain/usecases/auth/session'

export class DbUpdateAccountUseCase implements UpdateAccountUseCase {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hashComparer: HashComparer,
    private readonly hashCreator: HashCreator,
    private readonly deleteSessionByAccountId: DeleteSessionByAccountIdRepository,
    private readonly cacheRemoveByPrefix: CacheRemoveByPrefix,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly sendMailSession: SendMailSessionUseCase,
    private readonly mailFilePath: string,
    private readonly cacheRemove: CacheRemove
  ) {}

  async update ({ id, name, email, password, newPassword }: UpdateAccountDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(id)
    if (!accountById) {
      throw new AccountNotFoundError()
    }
    let passwordHashed = accountById.password
    if (password) {
      const isValidPassword = await this.hashComparer.compare({
        payload: password,
        hashedText: passwordHashed
      })
      if (!isValidPassword) {
        throw new InvalidCredentialsError()
      }
    }
    if (newPassword) {
      passwordHashed = await this.hashCreator.createHash(newPassword)
      await this.cacheRemoveByPrefix.removeByPrefix(`session-authentication:${id}`)
      await this.deleteSessionByAccountId.deleteByAccountId(id)
    }
    const changeEmail = (email) && (email !== accountById.email)
    const emailValided = changeEmail ? false : accountById.email_valided
    if (!email) {
      email = accountById.email
    }
    if (!name) {
      name = accountById.name
    }
    const updatedAccount = await this.updateAccountRepository.update({
      id: accountById.id,
      email,
      password: passwordHashed,
      name,
      email_valided: emailValided
    })
    if (changeEmail) {
      await this.sendMailSession.sendMail({
        accountId: updatedAccount.id,
        email: updatedAccount.email,
        name: updatedAccount.name,
        subject: `[Identity] - ${updatedAccount.name}, sua conta foi alterada com sucesso`,
        mailFilePath: this.mailFilePath,
        sessionType: SessionType.activeAccount
      })
    }
    await this.cacheRemove.remove(`account:${updatedAccount.email}`)
    return updatedAccount
  }
}
