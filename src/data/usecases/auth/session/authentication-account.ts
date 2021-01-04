import { AuthenticationAccount, AuthenticationAccountDTO } from '@/domain/usecases/auth/account'
import { GetAccountByEmailRepository, CreateSessionRepository } from '@/data/repositories/auth'
import { HashComparer, Encrypter } from '@/data/protocols/criptography'
import { SessionType, AuthenticationModel, AccountModel } from '@/domain/models/auth'
import { InvalidCredentialsError } from '@/data/errors'
import { CacheCreate, CacheRecover } from '@/data/protocols/cache'

export class DbAuthenticationAccount implements AuthenticationAccount {
  constructor (
    private readonly cacheRecover: CacheRecover,
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly cacheCreate: CacheCreate,
    private readonly createSessionRepository: CreateSessionRepository,
    private readonly encrypter: Encrypter
  ) {}

  async authenticate ({ email, password }: AuthenticationAccountDTO): Promise<AuthenticationModel> {
    const cacheKey = `account:${email}`
    let account: AccountModel
    account = await this.cacheRecover.recover<AccountModel>(cacheKey)
    let existsAccountInCache = Boolean(account)
    if(!existsAccountInCache){
      account = await this.getAccountByEmailRepository.getAccountByEmail(email)
    }
    if ((account) && (account.email_valided)) {
      const isCorrectPassword = await this.hashComparer.compare({
        payload: password,
        hashedText: account.password
      })
      if (!isCorrectPassword) {
        throw new InvalidCredentialsError()
      }
      if(!existsAccountInCache){
        await this.cacheCreate.create(cacheKey, account)
      }
      const session = await this.createSessionRepository.create({
        account_id: account.id,
        type: SessionType.authentication,
        experied_at: new Date(new Date().setDate(new Date().getDate() + 1))
      })
      const accessToken = await this.encrypter.encrypt(session.id)
      return {
        access_token: accessToken,
        account_type: account.type
      }
    }
    throw new InvalidCredentialsError()
  }
}
