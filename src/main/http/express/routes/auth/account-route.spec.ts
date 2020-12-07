import app from '@/main/config/express/app'
import request from 'supertest'
import faker from 'faker'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { AccountModel, AccountType, SessionModel, SessionType } from '@/domain/models/auth'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import uploadConfig from '@/main/config/multer/config'
import fs from 'fs'
import path from 'path'

let account: AccountModel
let managerAccount: AccountModel
let session: SessionModel
let managerSession: SessionModel
let sessionRepository: MemorySessionRepository
let accountRepository: MemoryAccountRepository
let encrypter: JWTEncrypterAdapter
let accessToken: string
let managerAccessToken: string

describe('Account Routes /account', () => {
  beforeAll(async () => {
    accountRepository = MemoryAccountRepository.getInstance()
    sessionRepository = MemorySessionRepository.getInstance()
    account = await accountRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    managerAccount = await accountRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    managerAccount = await accountRepository.update({
      ...managerAccount,
      email_valided: true,
      type: AccountType.manager
    })
    const sourceFile = `${uploadConfig.uploadDirectory}${path.sep}profile.png`
    const destinationFile = `${uploadConfig.uploadDirectory}${path.sep}${account.id}.png`
    await fs.promises.copyFile(sourceFile, destinationFile)
    await accountRepository.update({
      ...account,
      avatar_extention: '.png'
    })
  })

  afterAll(async () => {
    await fs.promises.unlink(`${uploadConfig.uploadDirectory}${path.sep}${account.id}.png`)
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

  describe('GET / - Show Account', () => {
    test('Should return 200 if access token is valid', async () => {
      await request(app)
        .get('/api/auth/account')
        .set('x-access-token', accessToken)
        .expect(200)
    })

    test('Should return 400 irecoverPasswordf access token not provide', async () => {
      await request(app)
        .get('/api/auth/account')
        .expect(400)
    })

    test('Should return 403 if access token is invalid', async () => {
      encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, -1)
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .get('/api/auth/account')
        .set('x-access-token', accessToken)
        .expect(403)
    })

    test('Should return 401 if session is expired', async () => {
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .get('/api/auth/account')
        .set('x-access-token', accessToken)
        .expect(401)
    })
  })

  describe('PUT / - Update Account', () => {
    test('Should return 200 if account is updated', async () => {
      await request(app)
        .put('/api/auth/account')
        .set('x-access-token', accessToken)
        .send({
          name: `${account.name} Updated`
        })
        .expect(200)
    })

    test('Should return 400 if access token not provide', async () => {
      await request(app)
        .put('/api/auth/account')
        .send({
          name: `${account.name} Updated`
        })
        .expect(400)
    })

    test('Should return 403 if access token is invalid', async () => {
      encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, -1)
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .put('/api/auth/account')
        .set('x-access-token', accessToken)
        .send({
          name: `${account.name} Updated`
        })
        .expect(403)
    })

    test('Should return 401 if session is expired', async () => {
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .put('/api/auth/account')
        .set('x-access-token', accessToken)
        .send({
          name: `${account.name} Updated`
        })
        .expect(401)
    })
  })

  describe('GET /avatar - Show Avatar Account', () => {
    test('Should return 200 if access token is valid', async () => {
      await request(app)
        .get('/api/auth/account/avatar')
        .set('x-access-token', accessToken)
        .responseType('blob')
        .expect(200)
    })

    test('Should return 400 if access token not provide', async () => {
      await request(app)
        .get('/api/auth/account/avatar')
        .expect(400)
    })

    test('Should return 403 if access token is invalid', async () => {
      encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, -1)
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .get('/api/auth/account/avatar')
        .set('x-access-token', accessToken)
        .expect(403)
    })

    test('Should return 401 if session is expired', async () => {
      session = await sessionRepository.create({
        account_id: account.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      accessToken = await encrypter.encrypt(session.id)
      await request(app)
        .get('/api/auth/account/avatar')
        .set('x-access-token', accessToken)
        .expect(401)
    })
  })

  describe('PUT /type - Set Account Type', () => {
    beforeEach(async () => {
      account = await accountRepository.update({
        ...account,
        email_valided: true,
        type: AccountType.student
      })
      encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
      managerSession = await sessionRepository.create({
        account_id: managerAccount.id,
        experied_at: faker.date.future(),
        type: SessionType.authentication
      })
      managerAccessToken = await encrypter.encrypt(managerSession.id)
    })

    test('Should return 200 if account is updated', async () => {
      await request(app)
        .put('/api/auth/account/type')
        .set('x-access-token', managerAccessToken)
        .send({
          account_id: account.id,
          account_type: AccountType.manager
        })
        .expect(200)
    })

    test('Should return 401 if account not is manager', async () => {
      await request(app)
        .put('/api/auth/account/type')
        .set('x-access-token', accessToken)
        .send({
          account_id: managerAccount.id,
          account_type: AccountType.manager
        })
        .expect(401)
    })

    test('Should return 400 if access token not provide', async () => {
      await request(app)
        .put('/api/auth/account/type')
        .expect(400)
    })

    test('Should return 403 if access token is invalid', async () => {
      encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, -1)
      managerSession = await sessionRepository.create({
        account_id: managerAccount.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      managerAccessToken = await encrypter.encrypt(session.id)
      await request(app)
        .put('/api/auth/account/type')
        .set('x-access-token', managerAccessToken)
        .expect(403)
    })

    test('Should return 401 if session is expired', async () => {
      managerSession = await sessionRepository.create({
        account_id: managerAccount.id,
        experied_at: faker.date.past(),
        type: SessionType.authentication
      })
      managerAccessToken = await encrypter.encrypt(session.id)
      await request(app)
        .put('/api/auth/account/type')
        .set('x-access-token', managerAccessToken)
        .expect(401)
    })
  })
})
