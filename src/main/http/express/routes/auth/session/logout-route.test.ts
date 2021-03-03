import app from '@/main/config/express/app'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { BCrypterHasherAdapter, JWTEncrypterAdapter } from '@/infra/criptografy'
import { AccountModel, SessionModel, SessionType } from '@/domain/models/auth'
import { HttpStatusCode } from '@/presentation/protocols'
import { EnvConfig } from '@/main/config/environment'
import request from 'supertest'
import faker from 'faker'
import { MissingParamError } from '@/validation/errors'
import { InvalidCredentialsError } from '@/data/errors'
import { AccessDeniedError } from '@/presentation/errors'

let account: AccountModel
let session: SessionModel
let accountRepository: MemoryAccountRepository
let sessionRepository: MemorySessionRepository
let hasher: BCrypterHasherAdapter
let encrypter: JWTEncrypterAdapter
let password: string
let accessToken: string
const url = '/api/auth/session'

describe('DELETE / - Logout', () => {
  beforeAll(async () => {
    accountRepository = MemoryAccountRepository.getInstance()
    sessionRepository = MemorySessionRepository.getInstance()
    hasher = new BCrypterHasherAdapter(12)
    password = faker.internet.password()
    account = await accountRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: await hasher.createHash(password)
    })
    account = await accountRepository.update({
      ...account,
      email_valided: true
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

  test('Should return noContent status code if logout is succeeds', async () => {
    await request(app)
      .delete(url)
      .set(EnvConfig.tokenName, accessToken)
      .expect(HttpStatusCode.noContent)
  })

  test('Should return badRequest status code if access token not provide', async () => {
    const response = await request(app).delete(url)
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
      experied_at: faker.date.past(),
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
