import app from '@/main/config/express/app'
import request from 'supertest'
import faker from 'faker'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { AccountModel, SessionModel, SessionType } from '@/domain/models/auth'

let account: AccountModel
let session: SessionModel
let sessionRepository: MemorySessionRepository

describe('Account Routes', () => {
  beforeAll(async () => {
    const accountRepository = MemoryAccountRepository.getInstance()
    sessionRepository = MemorySessionRepository.getInstance()
    account = await accountRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    session = await sessionRepository.create({
      account_id: account.id,
      experied_at: faker.date.future(),
      type: SessionType.activeAccount
    })
  })

  describe('POST - Create Account', () => {
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
  })

  describe('PUT - Active Account', () => {
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
})
