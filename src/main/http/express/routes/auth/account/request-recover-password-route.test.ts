import app from '@/main/config/express/app'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'
import { AccountModel } from '@/domain/models/auth'
import { HttpStatusCode } from '@/presentation/protocols'
import { InvalidParamError, MissingParamError } from '@/validation/errors'
import { AccountNotFoundError } from '@/data/errors'
import request from 'supertest'
import faker from 'faker'

let account: AccountModel
let accountRepository: MemoryAccountRepository
const url = '/api/auth/account/password'

describe('POST /password - Request recover password', () => {
  beforeAll(async () => {
    accountRepository = MemoryAccountRepository.getInstance()
    account = await accountRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
  })

  test('Should return ok status code on request password', async () => {
    await request(app)
      .post(url)
      .send({
        email: account.email
      })
      .expect(HttpStatusCode.ok)
  })

  test('Should return badRequest status code if account not found', async () => {
    const response = await request(app)
      .post(url)
      .send({
        email: faker.internet.email()
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new AccountNotFoundError().message
    })
  })

  test('Should return badRequest status code if e-mail not is provide', async () => {
    const response = await request(app).post(url)
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new MissingParamError('email').message
    })
  })

  test('Should return badRequest status code if e-mail is invalid', async () => {
    const response = await request(app).post(url).send({
      email: faker.name.findName()
    })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('email').message
    })
  })
})
