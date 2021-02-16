import app from '@/main/config/express/app'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { AccountModel } from '@/domain/models/auth'
import { HttpStatusCode } from '@/presentation/protocols'
import request from 'supertest'
import faker from 'faker'
import { InvalidCredentialsError } from '@/data/errors'
import { InvalidParamError, MissingParamError } from '@/validation/errors'

let account: AccountModel
let accountRepository: MemoryAccountRepository
let hasher: BCrypterHasherAdapter
let password: string
const url = '/api/auth/session'

describe('POST / - Authentication', () => {
  beforeAll(async () => {
    accountRepository = MemoryAccountRepository.getInstance()
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

  test('Should return ok status code if authentication is succeeds', async () => {
    await request(app)
      .post(url)
      .send({
        email: account.email,
        password
      })
      .expect(HttpStatusCode.ok)
  })

  test('Should return unauthorized status code if incorrect password is provide', async () => {
    const response = await request(app)
      .post(url)
      .send({
        email: account.email,
        password: faker.random.uuid()
      })
    expect(response.status).toBe(HttpStatusCode.unauthorized)
    expect(response.body).toEqual({
      error: new InvalidCredentialsError().message
    })
  })

  test('Should return unauthorized status code if incorrect password is provide', async () => {
    const response = await request(app)
      .post(url)
      .send({
        email: faker.internet.email(),
        password: faker.random.uuid()
      })
    expect(response.status).toBe(HttpStatusCode.unauthorized)
    expect(response.body).toEqual({
      error: new InvalidCredentialsError().message
    })
  })

  test('Should return badRequest status code if invalid e-mail is provide', async () => {
    const response = await request(app)
      .post(url)
      .send({
        email: faker.random.uuid(),
        password
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('email').message
    })
  })

  test('Should return badRequest status code if e-mail is not provide', async () => {
    const response = await request(app)
      .post(url)
      .send({
        password
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new MissingParamError('email').message
    })
  })

  test('Should return badRequest status code if password is not provide', async () => {
    const response = await request(app)
      .post(url)
      .send({
        email: account.email
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new MissingParamError('password').message
    })
  })
})
