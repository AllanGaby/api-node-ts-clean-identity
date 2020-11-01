import { CreateSessionModel } from '@/data/repositories/auth/session'
import { mockSessionModel } from '@/data/test'
import { mockCreateSessionModel } from '@/infra/test/db/mock-session'
import { MemorySessionModel } from '@/infra/db/memory/models/auth'
import { MemorySessionRepository } from './session'
import faker from 'faker'

interface sutTypes {
  sut: MemorySessionRepository
  createSessionParams: CreateSessionModel
}

const makeSut = (): sutTypes => {
  const createSessionParams = mockCreateSessionModel()
  const sut = new MemorySessionRepository()
  return {
    sut,
    createSessionParams
  }
}

const checkCreatedSession = (createdSession: MemorySessionModel, params: CreateSessionModel): void => {
  expect(createdSession.id).toBeTruthy()
  expect(createdSession.accountId).toBe(params.accountId)
  expect(createdSession.type).toBe(params.type)
  expect(createdSession.experied_at).toBe(params.experied_at)
  expect(createdSession.created_at).toBeTruthy()
  expect(createdSession.updated_at).toBeTruthy()
  expect(createdSession.deleted_at).toBeFalsy()
}

describe('MemorySessionRepository Create Method', () => {
  test('Should return new session account', async () => {
    const { sut, createSessionParams } = makeSut()
    const createdSession = await sut.create(createSessionParams)
    checkCreatedSession(createdSession, createSessionParams)
  })
})

describe('MemorySessionRepository GetSessionById Method', () => {
  test('Should return null if session not found', async () => {
    const { sut } = makeSut()
    const session = await sut.getSessionById(faker.random.uuid())
    expect(session).toBeFalsy()
  })

  test('Should return a session if session found', async () => {
    const { sut, createSessionParams } = makeSut()
    const createdSession = await sut.create(createSessionParams)
    const session = await sut.getSessionById(createdSession.id)
    checkCreatedSession(session, createSessionParams)
  })
})

describe('MemorySessionRepository Delete Method', () => {
  test('Should session list change after delete', async () => {
    const { sut, createSessionParams } = makeSut()
    const createdSession = await sut.create(createSessionParams)
    const beforeSession = await sut.getSessionById(createdSession.id)
    checkCreatedSession(beforeSession, createSessionParams)
    await sut.delete(createdSession)
    const afterSession = await sut.getSessionById(createdSession.id)
    expect(afterSession).toBeFalsy()
  })

  test('Should session list not change after delete if session not found', async () => {
    const { sut } = makeSut()
    const deletedSession = mockSessionModel()
    const beforeSession = await sut.getSessionById(deletedSession.id)
    expect(beforeSession).toBeFalsy()
    await sut.delete(deletedSession)
    const afterSession = await sut.getSessionById(deletedSession.id)
    expect(afterSession).toBeFalsy()
  })
})
