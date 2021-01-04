import { CacheRemoveByPrefix, CacheRemove } from '@/data/protocols/cache'
import { HashCreator } from '@/data/protocols/criptography'
import { UploadFile } from '@/data/protocols/storage'
import { GetAccountByIdRepository, UpdateAccountRepository, DeleteSessionByAccountIdRepository } from '@/data/repositories/auth'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { UpdateAccount, UpdateAccountDTO } from '@/domain/usecases/auth/account'
import { SendMailSession } from '@/domain/usecases/auth/session'
import path from 'path'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hashCreator: HashCreator,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly sendMailSession: SendMailSession,
    private readonly mailFilePath: string,
    private readonly uploadFile: UploadFile,
    private readonly deleteSessionByAccountId: DeleteSessionByAccountIdRepository,
    private readonly cacheRemoveByPrefix: CacheRemoveByPrefix,
    private readonly cacheRemove: CacheRemove
  ) {}

  async update ({ id, name, email, password, avatarFilePath }: UpdateAccountDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(id)
    if (accountById) {
      let passwordHashed = accountById.password
      if (password) {
        passwordHashed = await this.hashCreator.createHash(password)
        await this.cacheRemoveByPrefix.removeByPrefix(`session-authentication:${id}`)
        await this.deleteSessionByAccountId.deleteByAccountId(id)
      }
      let avatarExtention = accountById.avatar_extention
      if (avatarFilePath) {
        avatarExtention = path.extname(avatarFilePath)
        await this.uploadFile.upload({
          sourceFile: avatarFilePath,
          destinationFile: `${id}${avatarExtention}`
        })
      }
      const emailValided = email ? false : accountById.email_valided
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
        email_valided: emailValided,
        avatar_extention: avatarExtention
      })
      if (!emailValided) {
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
    throw new Error('Account not found')
  }
}
