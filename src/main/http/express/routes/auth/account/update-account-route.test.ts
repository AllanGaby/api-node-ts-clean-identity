import app from '@/main/config/express/app'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { AccountModel, SessionModel, SessionType } from '@/domain/models/auth'
import { BCrypterHasherAdapter, JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import { HttpStatusCode } from '@/presentation/protocols'
import { InvalidParamError, MissingParamError } from '@/validation/errors'
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
const url = '/api/auth/account'

describe('PUT / - Update Account', () => {
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

  test('Should return ok status code if account is updated', async () => {
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        name: `${account.name} Updated`
      })
    expect(response.status).toBe(HttpStatusCode.ok)
  })

  test('Should return badRequest status code if name is invalid', async () => {
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        name: faker.random.alphaNumeric(2)
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('name').message
    })
  })

  test('Should return badRequest status code if email is invalid', async () => {
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        email: faker.name.findName()
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('email').message
    })
  })

  test('Should return badRequest status code if password is invalid', async () => {
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        password: faker.random.alphaNumeric(5)
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('password').message
    })
  })

  test('Should return badRequest status code if password provide but new password not provide', async () => {
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        password: faker.internet.password()
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('new_password').message
    })
  })

  test('Should return badRequest status code if new password is invalid', async () => {
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        new_password: faker.random.alphaNumeric(5)
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('password').message
    })
  })

  test('Should return badRequest status code if new password provide but password not provide', async () => {
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        new_password: faker.internet.password()
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('password').message
    })
  })

  test('Should return badRequest status code if password_confirmation is invalid', async () => {
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        password: faker.internet.password(),
        new_password: faker.internet.password(),
        password_confirmation: faker.random.alphaNumeric(5)
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('password_confirmation').message
    })
  })

  test('Should return badRequest status code if password is incorrect', async () => {
    const password = faker.internet.password()
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        password: faker.internet.password(),
        new_password: password,
        password_confirmation: password
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidCredentialsError().message
    })
  })

  test('Should return ok status code if password is updated', async () => {
    const password = faker.internet.password()
    const response = await request(app)
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        password: accountPassword,
        new_password: password,
        password_confirmation: password
      })
    expect(response.status).toBe(HttpStatusCode.ok)
  })

  test('Should return badRequest status code if access token not provide', async () => {
    const response = await request(app)
      .put(url)
      .send({
        name: `${account.name} Updated`
      })
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
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        name: `${account.name} Updated`
      })
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
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        name: `${account.name} Updated`
      })
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
      .put(url)
      .set(EnvConfig.tokenName, accessToken)
      .send({
        name: `${account.name} Updated`
      })
    expect(response.status).toBe(HttpStatusCode.unauthorized)
    expect(response.body).toEqual({
      error: new AccessDeniedError().message
    })
  })
})
