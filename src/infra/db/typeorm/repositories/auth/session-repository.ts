import { Session } from '@/infra/db/typeorm/models'
import { CreateSessionRepository, CreateSessionModel, GetSessionByIdRepository, DeleteSessionByIdRepository, GetSessionByAccountIdRepository, DeleteSessionByAccountIdRepository } from '@/data/repositories/auth'
import { getRepository, Repository } from 'typeorm'

export class SessionRepositoryTypeORM implements CreateSessionRepository, GetSessionByIdRepository, DeleteSessionByIdRepository, GetSessionByAccountIdRepository, DeleteSessionByAccountIdRepository {
  private readonly sessionRepositoryTypeOrm: Repository<Session>

  constructor () {
    this.sessionRepositoryTypeOrm = getRepository<Session>(Session)
  }

  async create (data: CreateSessionModel): Promise<Session> {
    const createdSession = this.sessionRepositoryTypeOrm.create({
      ...data,
      deleted_at: null
    })
    await this.sessionRepositoryTypeOrm.save(createdSession)
    return createdSession
  }

  async getSessionById (id: string): Promise<Session> {
    if (!id) {
      return undefined
    }
    return await this.sessionRepositoryTypeOrm.findOne(id)
  }

  async deleteById (id: string): Promise<void> {
    if (id) {
      await this.sessionRepositoryTypeOrm.delete({
        id
      })
    }
  }

  async getSessionByAccountId (accountId: string): Promise<Session[]> {
    if (!accountId) {
      return []
    }
    return await this.sessionRepositoryTypeOrm.find({
      where: {
        account_id: accountId
      }
    })
  }

  async deleteByAccountId (accountId: string): Promise<void> {
    if (accountId) {
      await this.sessionRepositoryTypeOrm.delete({
        account_id: accountId
      })
    }
  }
}
