import app from '@/main/config/express/app'
import { MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'
import { MemoryFileRepository } from '@/infra/db/memory/repositories/files'
import { AccountModel } from '@/domain/models/auth'
import { HttpStatusCode } from '@/presentation/protocols'
import { EnvConfig } from '@/main/config/env'
import { FileModel } from '@/domain/models/files'
import fs from 'fs'
import path from 'path'
import request from 'supertest'
import faker from 'faker'

let account: AccountModel
let accountRepository: MemoryAccountRepository
let fileRepository: MemoryFileRepository
let accountFilePath: string
let file: FileModel
const defaultFilePath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..', '..', EnvConfig.uploadAvatarDir, 'default.png')
const testFilePath = `${EnvConfig.uploadAvatarDir}/test.jpg`
const url = '/api/auth/account/avatar/'

describe('GET /avatar/:avatar_id - Show Avatar Account', () => {
  beforeAll(async () => {
    fileRepository = MemoryFileRepository.getInstance()
    accountRepository = MemoryAccountRepository.getInstance()
    file = await fileRepository.create({
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
  })

  afterAll(async () => {
    fs.promises.unlink(accountFilePath)
  })

  test('Should return ok status code and default avatar if account without avatar', async () => {
    const response = await request(app).get(`${url}`)
    const fileTest = await fs.promises.readFile(defaultFilePath)
    const buffer = Buffer.from(response.body)
    expect(response.status).toBe(HttpStatusCode.ok)
    expect(fileTest.toString()).toBe(buffer.toString())
  })

  test('Should return ok status code and correct avatar if account have avatar', async () => {
    account.avatar_file_id = file.id
    const response = await request(app).get(`${url}${account.avatar_file_id}`)
    const fileTest = await fs.promises.readFile(accountFilePath)
    const buffer = Buffer.from(response.body)
    expect(response.status).toBe(HttpStatusCode.ok)
    expect(fileTest.toString()).toBe(buffer.toString())
  })
})
