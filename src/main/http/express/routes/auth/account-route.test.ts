import app from '@/main/config/express/app'
import { mockCreateAccountRequest } from '@/presentation/test/auth'
import request from 'supertest'

describe('Account Routes', () => {
  describe('POST /account', () => {
    test('Should return 200 on create account', async () => {
      const createAccountRequest = mockCreateAccountRequest()
      const result = await request(app)
        .post('/api/account')
        .send(createAccountRequest.body)
      console.log(result.body)
      const result2 = await request(app)
        .post('/api/account')
        .send(createAccountRequest.body)
      console.log(result2.body)
    })
  })
})
