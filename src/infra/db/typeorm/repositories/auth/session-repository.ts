import { Session } from '@/infra/db/typeorm/models'
import { CreateSessionRepository, CreateSessionModel, GetSessionByIdRepository } from '@/data/repositories/auth'
import { getRepository, Repository } from 'typeorm'

export class SessionRepositoryTypeORM implements CreateSessionRepository, GetSessionByIdRepository {
  private readonly sessionRepositoryTypeOrm: Repository<Session>

  constructor () {
    this.sessionRepositoryTypeOrm = getRepository<Session>(Session)
  }

  async create (data: CreateSessionModel): Promise<Session> {
    const createdSession = this.sessionRepositoryTypeOrm.create({
      ...data
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
}
