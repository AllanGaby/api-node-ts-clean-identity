import app from '@/main/config/express/app'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { AccountModel, SessionModel, SessionType } from '@/domain/models/auth'
import { HttpStatusCode } from '@/presentation/protocols'
import { InvalidCredentialsError } from '@/data/errors'
import { InvalidParamError, MissingParamError } from '@/validation/errors'
import request from 'supertest'
import faker from 'faker'

let account: AccountModel
let session: SessionModel
let sessionRepository: MemorySessionRepository
let accountRepository: MemoryAccountRepository
const url = '/api/auth/account/password'

describe('PUT /password - Recover password', () => {
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
      type: SessionType.recoverPassword
    })
  })

  test('Should return ok status code on recover password', async () => {
    const password = faker.internet.password()
    await request(app)
      .put(url)
      .send({
        session_id: session.id,
        password,
        password_confirmation: password
      })
      .expect(HttpStatusCode.ok)
  })

  test('Should return badRequest status code if session not found', async () => {
    const password = faker.internet.password()
    const response = await request(app)
      .put(url)
      .send({
        session_id: faker.random.uuid(),
        password,
        password_confirmation: password
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidCredentialsError().message
    })
  })

  test('Should return badRequest status code if password not provide', async () => {
    const response = await request(app)
      .put(url)
      .send({
        session_id: session.id
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new MissingParamError('password').message
    })
  })

  test('Should return badRequest status code if password is invalid', async () => {
    const response = await request(app)
      .put(url)
      .send({
        session_id: session.id,
        password: faker.random.alphaNumeric(5)
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('password').message
    })
  })

  test('Should return badRequest status code if password confirmation is different of password', async () => {
    const response = await request(app)
      .put(url)
      .send({
        session_id: session.id,
        password: faker.internet.password(),
        password_confirmation: faker.random.uuid()
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('password_confirmation').message
    })
  })
})
