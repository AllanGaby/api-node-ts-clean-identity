import { CreateSessionModel } from '@/data/repositories/auth/session'
import { mockCreateSessionModel } from '@/infra/test/db/mock-session'
import { MemorySessionModel } from '../../models/auth'
import { MemorySessionRepository } from './session'

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
