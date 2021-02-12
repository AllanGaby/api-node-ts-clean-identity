import app from '@/main/config/express/app'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { AccountModel, SessionModel, SessionType } from '@/domain/models/auth'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import { HttpStatusCode } from '@/presentation/protocols'
import request from 'supertest'
import faker from 'faker'

let account: AccountModel
let session: SessionModel
let sessionRepository: MemorySessionRepository
let accountRepository: MemoryAccountRepository
let encrypter: JWTEncrypterAdapter
let accessToken: string

describe('Account Routes /account', () => {
  beforeAll(async () => {
    accountRepository = MemoryAccountRepository.getInstance()
    sessionRepository = MemorySessionRepository.getInstance()
    account = await accountRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
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

  describe('POST / - Create Account', () => {
    test('Should return created status code on account created', async () => {
      const password = faker.internet.password()
      await request(app)
        .post('/api/auth/account')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password,
          password_confirmation: password
        })
        .expect(HttpStatusCode.created)
    })

    test('Should return badRequest status code if account is without name', async () => {
      const password = faker.internet.password()
      await request(app)
        .post('/api/auth/account')
        .send({
          email: faker.internet.email(),
          password,
          password_confirmation: password
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return badRequest status code if account is without e-mail', async () => {
      const password = faker.internet.password()
      await request(app)
        .post('/api/auth/account')
        .send({
          name: faker.name.findName(),
          password,
          password_confirmation: password
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return badRequest status code if account is without password', async () => {
      await request(app)
        .post('/api/auth/account')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email()
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return badRequest status code if account password_confirmation is different of password', async () => {
      await request(app)
        .post('/api/auth/account')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          password_confirmation: faker.random.uuid()
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return forbidden status code if exists other account with same e-mail', async () => {
      await request(app)
        .post('/api/auth/account')
        .send({
          name: account.name,
          email: account.email,
          password: account.password,
          password_confirmation: account.password
        })
        .expect(HttpStatusCode.forbidden)
    })
  })

  describe('PUT /:session_id - Active Account', () => {
    beforeEach(async () => {
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.future(),
        type: SessionType.activeAccount
      })
    })

    test('Should return ok status code on active account', async () => {
      await request(app)
        .put(`/api/auth/account/${session.id}`)
        .expect(HttpStatusCode.ok)
    })

    test('Should return badRequest status code if session is invalid', async () => {
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.future(),
        type: SessionType.authentication
      })
      await request(app)
        .put(`/api/auth/account/${session.id}`)
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return badRequest status code if session not found', async () => {
      await request(app)
        .put(`/api/auth/account/${faker.random.uuid()}`)
        .expect(HttpStatusCode.badRequest)
    })
  })

  describe('POST /password - Request recover password', () => {
    test('Should return ok status code on request password', async () => {
      await request(app)
        .post('/api/auth/account/password')
        .send({
          email: account.email
        })
        .expect(HttpStatusCode.ok)
    })

    test('Should return badRequest status code if account not found', async () => {
      await request(app)
        .post('/api/auth/account/password')
        .send({
          email: faker.internet.email()
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return badRequest status code if e-mail not is provide', async () => {
      await request(app)
        .post('/api/auth/account/password')
        .expect(HttpStatusCode.badRequest)
    })
  })

  describe('PUT /password - Recover password', () => {
    beforeEach(async () => {
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.future(),
        type: SessionType.recoverPassword
      })
    })

    test('Should return ok status code on recover password', async () => {
      const password = faker.internet.password()
      await request(app)
        .put('/api/auth/account/password')
        .send({
          session_id: session.id,
          password,
          password_confirmation: password
        })
        .expect(HttpStatusCode.ok)
    })

    test('Should return badRequest status code if session not found', async () => {
      const password = faker.internet.password()
      await request(app)
        .put('/api/auth/account/password')
        .send({
          session_id: faker.random.uuid(),
          password,
          password_confirmation: password
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return badRequest status code if password not provide', async () => {
      await request(app)
        .put('/api/auth/account/password')
        .send({
          session_id: session.id
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return badRequest status code if password confirmation is different of password', async () => {
      await request(app)
        .put('/api/auth/account/password')
        .send({
          session_id: session.id,
          password: faker.internet.password(),
          password_confirmation: faker.random.uuid()
        })
        .expect(HttpStatusCode.badRequest)
    })
  })

  describe('GET / - Show Account', () => {
    test('Should return ok status code if access token is valid', async () => {
      await request(app)
        .get('/api/auth/account')
        .set(EnvConfig.tokenName, accessToken)
        .expect(HttpStatusCode.ok)
    })

    test('Should return badRequest status code irecoverPasswordf access token not provide', async () => {
      await request(app)
        .get('/api/auth/account')
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return forbidden status code if access token is invalid', async () => {
      encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, -1)
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .get('/api/auth/account')
        .set(EnvConfig.tokenName, accessToken)
        .expect(HttpStatusCode.forbidden)
    })

    test('Should return unauthorized status code if session is expired', async () => {
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .get('/api/auth/account')
        .set(EnvConfig.tokenName, accessToken)
        .expect(HttpStatusCode.unauthorized)
    })
  })

  describe('PUT / - Update Account', () => {
    test('Should return ok status code if account is updated', async () => {
      await request(app)
        .put('/api/auth/account')
        .set(EnvConfig.tokenName, accessToken)
        .send({
          name: `${account.name} Updated`
        })
        .expect(HttpStatusCode.ok)
    })

    test('Should return badRequest status code if access token not provide', async () => {
      await request(app)
        .put('/api/auth/account')
        .send({
          name: `${account.name} Updated`
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return forbidden status code if access token is invalid', async () => {
      encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, -1)
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .put('/api/auth/account')
        .set(EnvConfig.tokenName, accessToken)
        .send({
          name: `${account.name} Updated`
        })
        .expect(HttpStatusCode.forbidden)
    })

    test('Should return unauthorized status code if session is expired', async () => {
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .put('/api/auth/account')
        .set(EnvConfig.tokenName, accessToken)
        .send({
          name: `${account.name} Updated`
        })
        .expect(HttpStatusCode.unauthorized)
    })
  })
})
