import app from '@/main/config/express/app'
import { mockCreateAccountRequest } from '@/presentation/test/auth'
import request from 'supertest'

describe('Account Routes', () => {
  describe('POST /account', () => {
    test('Should return 200 on create account', async () => {
      const createAccountRequest = mockCreateAccountRequest()
      createAccountRequest.body.email = 'allan.gaby@gmail.com'
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
})
