import app from '@/main/config/express/app'
import request from 'supertest'
import faker from 'faker'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { AccountModel, SessionModel, SessionType } from '@/domain/models/auth'

let account: AccountModel
let session: SessionModel
let sessionRepository: MemorySessionRepository
let accountRepository: MemoryAccountRepository

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

  describe('POST / - Create Account', () => {
    test('Should return 201 on account created', async () => {
      const password = faker.internet.password()
      await request(app)
        .post('/api/auth/account')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password,
          password_confirmation: password
        })
        .expect(201)
    })

    test('Should return 400 if account is without name', async () => {
      const password = faker.internet.password()
      await request(app)
        .post('/api/auth/account')
        .send({
          email: faker.internet.email(),
          password,
          password_confirmation: password
        })
        .expect(400)
    })

    test('Should return 400 if account is without e-mail', async () => {
      const password = faker.internet.password()
      await request(app)
        .post('/api/auth/account')
        .send({
          name: faker.name.findName(),
          password,
          password_confirmation: password
        })
        .expect(400)
    })

    test('Should return 400 if account is without password', async () => {
      await request(app)
        .post('/api/auth/account')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email()
        })
        .expect(400)
    })

    test('Should return 400 if account password_confirmation is different of password', async () => {
      await request(app)
        .post('/api/auth/account')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          password_confirmation: faker.random.uuid()
        })
        .expect(400)
    })

    test('Should return 403 if exists other account with same e-mail', async () => {
      await request(app)
        .post('/api/auth/account')
        .send({
          name: account.name,
          email: account.email,
          password: account.password,
          password_confirmation: account.password
        })
        .expect(403)
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

    test('Should return 200 on active account', async () => {
      await request(app)
        .put(`/api/auth/account/${session.id}`)
        .expect(200)
    })

    test('Should return 400 if session is invalid', async () => {
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.future(),
        type: SessionType.authentication
      })
      await request(app)
        .put(`/api/auth/account/${session.id}`)
        .expect(400)
    })

    test('Should return 400 if session not found', async () => {
      await request(app)
        .put(`/api/auth/account/${faker.random.uuid()}`)
        .expect(400)
    })
  })

  describe('POST /password - Request recover password', () => {
    test('Should return 200 on request password', async () => {
      await request(app)
        .post('/api/auth/account/password')
        .send({
          email: account.email
        })
        .expect(200)
    })

    test('Should return 400 if account not found', async () => {
      await request(app)
        .post('/api/auth/account/password')
        .send({
          email: faker.internet.email()
        })
        .expect(400)
    })

    test('Should return 400 if e-mail not is provide', async () => {
      await request(app)
        .post('/api/auth/account/password')
        .expect(400)
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

    test('Should return 200 on recover password', async () => {
      const password = faker.internet.password()
      await request(app)
        .put('/api/auth/account/password')
        .send({
          session_id: session.id,
          password,
          password_confirmation: password
        })
        .expect(200)
    })

    test('Should return 400 if session not found', async () => {
      const password = faker.internet.password()
      await request(app)
        .put('/api/auth/account/password')
        .send({
          session_id: faker.random.uuid(),
          password,
          password_confirmation: password
        })
        .expect(400)
    })

    test('Should return 400 if password not provide', async () => {
      await request(app)
        .put('/api/auth/account/password')
        .send({
          session_id: session.id
        })
        .expect(400)
    })

    test('Should return 400 if password confirmation is different of password', async () => {
      await request(app)
        .put('/api/auth/account/password')
        .send({
          session_id: session.id,
          password: faker.internet.password(),
          password_confirmation: faker.random.uuid()
        })
        .expect(400)
    })
  })
})
