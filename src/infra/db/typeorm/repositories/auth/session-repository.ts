import { Session } from '@/infra/db/typeorm/models'
import { CreateSessionRepository, CreateSessionModel } from '@/data/repositories/auth'
import { getRepository, Repository } from 'typeorm'

export class SessionRepositoryTypeORM implements CreateSessionRepository {
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
}
