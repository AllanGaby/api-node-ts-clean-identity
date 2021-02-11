import app from '@/main/config/express/app'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { BCrypterHasherAdapter, JWTEncrypterAdapter } from '@/infra/criptografy'
import { AccountModel, SessionModel, SessionType } from '@/domain/models/auth'
import { HttpStatusCode } from '@/presentation/protocols'
import { EnvConfig } from '@/main/config/env'
import request from 'supertest'
import faker from 'faker'

let account: AccountModel
let session: SessionModel
let accountRepository: MemoryAccountRepository
let sessionRepository: MemorySessionRepository
let hasher: BCrypterHasherAdapter
let encrypter: JWTEncrypterAdapter
let password: string
let accessToken: string

describe('Session Routes /session', () => {
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

  describe('POST / - Authentication', () => {
    test('Should return ok status code if authentication is succeeds', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: account.email,
          password
        })
        .expect(HttpStatusCode.ok)
    })

    test('Should return unauthorized status code if incorrect password is provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: account.email,
          password: faker.random.uuid()
        })
        .expect(HttpStatusCode.unauthorized)
    })

    test('Should return unauthorized status code if incorrect password is provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: faker.internet.email(),
          password: faker.random.uuid()
        })
        .expect(HttpStatusCode.unauthorized)
    })

    test('Should return badRequest status code if invalid e-mail is provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: faker.random.uuid(),
          password
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return badRequest status code if e-mail is not provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          password
        })
        .expect(HttpStatusCode.badRequest)
    })

    test('Should return badRequest status code if password is not provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: account.email
        })
        .expect(HttpStatusCode.badRequest)
    })
  })

  describe('DELETE / - Logout', () => {
    test('Should return noContent status code if logout is succeeds', async () => {
      await request(app)
        .delete('/api/auth/session')
        .set(EnvConfig.tokenName, accessToken)
        .expect(HttpStatusCode.noContent)
    })

    test('Should return badRequest status code if access token not provide', async () => {
      await request(app)
        .delete('/api/auth/session')
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
        .delete('/api/auth/session')
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
        .delete('/api/auth/session')
        .set(EnvConfig.tokenName, accessToken)
        .expect(HttpStatusCode.unauthorized)
    })
  })
})
