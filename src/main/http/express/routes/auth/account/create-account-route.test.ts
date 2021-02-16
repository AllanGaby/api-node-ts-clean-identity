import app from '@/main/config/express/app'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'
import { HttpStatusCode } from '@/presentation/protocols'
import { InvalidParamError, MissingParamError } from '@/validation/errors'
import { EmailInUseError } from '@/data/errors'
import request from 'supertest'
import faker from 'faker'

const url = '/api/auth/account'

describe('POST / - Create Account', () => {
  test('Should return created status code on account created', async () => {
    const password = faker.internet.password()
    await request(app)
      .post(url)
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
    const response = await request(app)
      .post(url)
      .send({
        email: faker.internet.email(),
        password,
        password_confirmation: password
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new MissingParamError('name').message
    })
  })

  test('Should return badRequest status code if account name is invalid', async () => {
    const password = faker.internet.password()
    const response = await request(app)
      .post(url)
      .send({
        name: 'a',
        email: faker.internet.email(),
        password,
        password_confirmation: password
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('name').message
    })
  })

  test('Should return badRequest status code if account is without e-mail', async () => {
    const password = faker.internet.password()
    const response = await request(app)
      .post(url)
      .send({
        name: faker.name.findName(),
        password,
        password_confirmation: password
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new MissingParamError('email').message
    })
  })

  test('Should return badRequest status code if account e-mail is invalid', async () => {
    const password = faker.internet.password()
    const response = await request(app)
      .post(url)
      .send({
        name: faker.name.findName(),
        email: faker.name.findName(),
        password,
        password_confirmation: password
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('email').message
    })
  })

  test('Should return badRequest status code if account is without password', async () => {
    const response = await request(app)
      .post(url)
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password_confirmation: faker.internet.password()
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new MissingParamError('password').message
    })
  })

  test('Should return badRequest status code if account password is invalid', async () => {
    const response = await request(app)
      .post(url)
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(3),
        password_confirmation: faker.internet.password()
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('password').message
    })
  })

  test('Should return badRequest status code if account is without password_confirmation', async () => {
    const response = await request(app)
      .post(url)
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new MissingParamError('password_confirmation').message
    })
  })

  test('Should return badRequest status code if account password_confirmation is different of password', async () => {
    const response = await request(app)
      .post(url)
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        password_confirmation: faker.random.uuid()
      })
    expect(response.status).toBe(HttpStatusCode.badRequest)
    expect(response.body).toEqual({
      error: new InvalidParamError('password_confirmation').message
    })
  })

  test('Should return forbidden status code if exists other account with same e-mail', async () => {
    const accountRepository = MemoryAccountRepository.getInstance()
    const account = await accountRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })

    const response = await request(app)
      .post(url)
      .send({
        name: account.name,
        email: account.email,
        password: account.password,
        password_confirmation: account.password
      })
    expect(response.status).toBe(HttpStatusCode.forbidden)
    expect(response.body).toEqual({
      error: new EmailInUseError().message
    })
  })
})
