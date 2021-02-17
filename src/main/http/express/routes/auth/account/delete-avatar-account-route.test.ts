import app from '@/main/config/express/app'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { AccountModel, SessionModel, SessionType } from '@/domain/models/auth'
import { BCrypterHasherAdapter, JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import { HttpStatusCode } from '@/presentation/protocols'
import { MissingParamError } from '@/validation/errors'
import { InvalidCredentialsError } from '@/data/errors'
import { AccessDeniedError } from '@/presentation/errors'
import request from 'supertest'
import faker from 'faker'

let account: AccountModel
let session: SessionModel
let sessionRepository: MemorySessionRepository
let accountRepository: MemoryAccountRepository
let encrypter: JWTEncrypterAdapter
let accessToken: string
let accountPassword: string
const url = '/api/auth/account/avatar'

describe('DELETE /avatar - Delete Avatar Account', () => {
  beforeAll(async () => {
    const hasher = new BCrypterHasherAdapter(12)
    accountRepository = MemoryAccountRepository.getInstance()
    sessionRepository = MemorySessionRepository.getInstance()
    accountPassword = faker.internet.password()
    account = await accountRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: await hasher.createHash(accountPassword)
    })
  })

  beforeEach(async () => {
    encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
    session = await sessionRepository.create({
      account_id: account.id,
      experied_at: faker.date.future(),
      type: SessionType.authentication
    })
    accessToken = await encrypter.encrypt(session.id)
  })

  test('Should return ok status code if avatar account is deleted', async () => {
    const response = await request(app)
      .delete(url)
      .set(EnvConfig.tokenName, accessToken)
    expect(account.avatar_file_id).toBeFalsy()
    expect(response.status).toBe(HttpStatusCode.ok)
    expect(response.body.avatar_file_id).toBeFalsy()
  })

  test('Should return badRequest status code if access token not provide', async () => {
    const response = await request(app)
      .delete(url)
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new MissingParamError(EnvConfig.tokenName).message
    })
  })

  test('Should return forbidden status code if access token is invalid', async () => {
    encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, -1)
    session = await sessionRepository.create({
      account_id: account.id,
      experied_at: faker.date.past(),
      type: SessionType.authentication
    })
    accessToken = await encrypter.encrypt(session.id)
    const response = await request(app)
      .delete(url)
      .set(EnvConfig.tokenName, accessToken)
    expect(response.status).toBe(HttpStatusCode.forbidden)
    expect(response.body).toEqual({
      error: new InvalidCredentialsError().message
    })
  })

  test('Should return unauthorized status code if session is expired', async () => {
    session = await sessionRepository.create({
      account_id: account.id,
      experied_at: faker.date.past(),
      type: SessionType.authentication
    })
    accessToken = await encrypter.encrypt(session.id)
    const response = await request(app)
      .delete(url)
      .set(EnvConfig.tokenName, accessToken)
    expect(response.status).toBe(HttpStatusCode.unauthorized)
    expect(response.body).toEqual({
      error: new AccessDeniedError().message
    })
  })

  test('Should return unauthorized status code if session type is invalid', async () => {
    session = await sessionRepository.create({
      account_id: account.id,
      experied_at: faker.date.future(),
      type: SessionType.activeAccount
    })
    accessToken = await encrypter.encrypt(session.id)
    const response = await request(app)
      .delete(url)
      .set(EnvConfig.tokenName, accessToken)
    expect(response.status).toBe(HttpStatusCode.unauthorized)
    expect(response.body).toEqual({
      error: new AccessDeniedError().message
    })
  })
})
