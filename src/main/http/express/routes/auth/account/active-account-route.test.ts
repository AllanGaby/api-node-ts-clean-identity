import app from '@/main/config/express/app'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { AccountModel, SessionModel, SessionType } from '@/domain/models/auth'
import { HttpStatusCode } from '@/presentation/protocols'
import { InvalidCredentialsError } from '@/data/errors'
import request from 'supertest'
import faker from 'faker'

let account: AccountModel
let session: SessionModel
let sessionRepository: MemorySessionRepository
let accountRepository: MemoryAccountRepository
const url = '/api/auth/account/active/'

describe('PUT /active/:session_id - Active Account', () => {
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
    session = await sessionRepository.create({
      account_id: account.id,
      experied_at: faker.date.future(),
      type: SessionType.activeAccount
    })
  })

  test('Should return ok status code on active account', async () => {
    await request(app)
      .put(`${url}${session.id}`)
      .expect(HttpStatusCode.ok)
  })

  test('Should return badRequest status code if session type is invalid', async () => {
    session = await sessionRepository.create({
      account_id: account.id,
      experied_at: faker.date.future(),
      type: SessionType.authentication
    })
    const response = await request(app).put(`${url}${session.id}`)
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidCredentialsError().message
    })
  })

  test('Should return badRequest status code if session is expired', async () => {
    session = await sessionRepository.create({
      account_id: account.id,
      experied_at: faker.date.past(),
      type: SessionType.activeAccount
    })
    const response = await request(app).put(`${url}${session.id}`)
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidCredentialsError().message
    })
  })

  test('Should return badRequest status code if session not found', async () => {
    const response = await request(app).put(`${url}${faker.random.uuid()}`)
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidCredentialsError().message
    })
  })

  test('Should return badRequest status code if account of session is not found', async () => {
    session = await sessionRepository.create({
      account_id: faker.random.uuid(),
      experied_at: faker.date.past(),
      type: SessionType.activeAccount
    })
    const response = await request(app).put(`${url}${session.id}`)
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidCredentialsError().message
    })
  })
})
