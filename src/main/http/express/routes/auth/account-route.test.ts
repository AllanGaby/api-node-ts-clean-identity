import app from '@/main/config/express/app'
import { mockCreateAccountRequest, mockAuthenticationAccountRequest } from '@/presentation/test/auth'
import request from 'supertest'
import faker from 'faker'

describe('Account Routes', () => {
  describe('POST /account', () => {
    test('Should return 201 on create account', async () => {
      const createAccountRequest = mockCreateAccountRequest()
      await request(app)
        .post('/api/account')
        .send(createAccountRequest.body)
        .expect(201)
      await request(app)
        .post('/api/account')
        .send(createAccountRequest.body)
        .expect(403)
    })
  })

  describe('GET /account/:session_id', () => {
    test('Should return 200 on active account', async () => {
      const createAccountRequest = mockCreateAccountRequest()
      const session = await request(app)
        .post('/api/account')
        .send(createAccountRequest.body)
      await request(app)
        .get(`/api/account/${session.body.id}`)
        .expect(200)
    })
    test('Should return 400 if account not fould', async () => {
      await request(app)
        .get(`/api/account/${faker.random.uuid()}`)
        .expect(400)
    })
  })

  describe('POST /account/login', () => {
    test('Should return 401 if account not fould', async () => {
      const authenticationAccountRequest = mockAuthenticationAccountRequest()
      await request(app)
        .post('/api/account/login')
        .send(authenticationAccountRequest.body)
        .expect(401)
    })
    test('Should return 401 if account is not validaded', async () => {
      const createAccountRequest = mockCreateAccountRequest()
      await request(app)
        .post('/api/account')
        .send(createAccountRequest.body)
      await request(app)
        .post('/api/account/login')
        .send({ email: createAccountRequest.body.email, password: createAccountRequest.body.password })
        .expect(401)
    })
    test('Should return 200 if authentication succeeds', async () => {
      const createAccountRequest = mockCreateAccountRequest()
      const session = await request(app)
        .post('/api/account')
        .send(createAccountRequest.body)
      await request(app)
        .get(`/api/account/${session.body.id}`)
        .expect(200)
      await request(app)
        .post('/api/account/login')
        .send({ email: createAccountRequest.body.email, password: createAccountRequest.body.password })
        .expect(200)
    })
  })
})
