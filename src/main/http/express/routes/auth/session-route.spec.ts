import app from '@/main/config/express/app'
import request from 'supertest'
import faker from 'faker'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { AccountModel } from '@/domain/models/auth'

let account: AccountModel
let accountRepository: MemoryAccountRepository
let hasher: BCrypterHasherAdapter
let password: string

describe('Session Routes /session', () => {
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

  describe('POST / - Authentication', () => {
    test('Should return 200 if authentication is succeeds', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: account.email,
          password
        })
        .expect(200)
    })

    test('Should return 401 if incorrect password is provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: account.email,
          password: faker.random.uuid()
        })
        .expect(401)
    })

    test('Should return 401 if incorrect password is provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: faker.internet.email(),
          password: faker.random.uuid()
        })
        .expect(401)
    })

    test('Should return 400 if invalid e-mail is provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: faker.random.uuid(),
          password
        })
        .expect(400)
    })

    test('Should return 400 if e-mail is not provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          password
        })
        .expect(400)
    })

    test('Should return 400 if password is not provide', async () => {
      await request(app)
        .post('/api/auth/session')
        .send({
          email: account.email
        })
        .expect(400)
    })
  })
})
