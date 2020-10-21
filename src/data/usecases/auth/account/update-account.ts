import { HashCreator } from '@/data/protocols/criptography'
import { UploadFile } from '@/data/protocols/storage'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'
import { UpdateAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { SendMailAccount, UpdateAccount } from '@/domain/usecases/auth/account'
import path from 'path'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hashCreator: HashCreator,
    private readonly updateAccountRepoitory: UpdateAccountRepository,
    private readonly sendMailAccount: SendMailAccount,
    private readonly mailFilePath: string,
    private readonly uploadFile: UploadFile,
    private readonly fileDestinationDir: string
  ) {}

  async update ({ id, name, email, password, avatarFilePath }: UpdateAccountDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(id)
    if (accountById) {
      let passwordHashed = accountById.password
      if (password) {
        passwordHashed = await this.hashCreator.createHash(password)
      }
      if (avatarFilePath) {
        const extFile = path.extname(avatarFilePath)
        await this.uploadFile.upload({
          sourceFilePath: avatarFilePath,
          destinationFilePath: `${this.fileDestinationDir}${path.sep}${id}${extFile}`
        })
      }
      const emailValided = email ? false : accountById.email_valided
      const updatedAccount = await this.updateAccountRepoitory.update({
        id: accountById.id,
        email,
        password: passwordHashed,
        name,
        email_valided: emailValided
      })
      if (!emailValided) {
        await this.sendMailAccount.sendMail({
          accountId: updatedAccount.id,
          email: updatedAccount.email,
          name: updatedAccount.name,
          subject: `[Identity] - ${updatedAccount.name}, sua conta foi alterada com sucesso`,
          mailFilePath: this.mailFilePath,
          sessionType: SessionType.activeAccount
        })
      }
      return updatedAccount
    }
    return null
  }
}
