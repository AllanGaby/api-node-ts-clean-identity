import app from '@/main/config/express/app'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'
import { MemoryFileRepository } from '@/infra/db/memory/repositories/files'
import { AccountModel } from '@/domain/models/auth'
import { HttpStatusCode } from '@/presentation/protocols'
import { EnvConfig } from '@/main/config/env'
import fs from 'fs'
import request from 'supertest'
import faker from 'faker'

let account: AccountModel
let accountRepository: MemoryAccountRepository
let fileRepository: MemoryFileRepository
let accountFilePath: string
const testFilePath = `${EnvConfig.uploadAvatarDir}/test.jpg`
const url = '/api/auth/account/avatar/'

describe('GET /avatar/:avatar_id - Show Avatar Account', () => {
  beforeAll(async () => {
    fileRepository = MemoryFileRepository.getInstance()
    accountRepository = MemoryAccountRepository.getInstance()
    const file = await fileRepository.create({
      dir: EnvConfig.uploadAvatarDir,
      extention: '.jpg'
    })
    accountFilePath = `${file.dir}/${file.id}.jpg`
    fs.promises.copyFile(testFilePath, accountFilePath)
    account = await accountRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    account.avatar_file_id = file.id
  })

  afterAll(async () => {
    fs.promises.unlink(accountFilePath)
  })

  test('Should return ok status code and avatar file', async () => {
    const response = await request(app).get(`${url}${account.avatar_file_id}`)
    expect(response.status).toBe(HttpStatusCode.ok)
  })
})
