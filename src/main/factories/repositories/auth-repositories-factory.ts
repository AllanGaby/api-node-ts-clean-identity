import { AccountRepositoryTypeORM, SessionRepositoryTypeORM } from '@/infra/db/typeorm/repositories/auth'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { RepositoryTypes } from './'

export class AuthRepositoriesFactory {
  constructor (private readonly type: RepositoryTypes) {}

  public getAccountRepository (): AccountRepositoryTypeORM | MemoryAccountRepository {
    switch (this.type) {
      case RepositoryTypes.Memory:
        return MemoryAccountRepository.getInstance()
      case RepositoryTypes.TypeOrm:
        return AccountRepositoryTypeORM.getInstance()
    }
  }

  public getSessionRepository (): SessionRepositoryTypeORM | MemorySessionRepository {
    switch (this.type) {
      case RepositoryTypes.Memory:
        return MemorySessionRepository.getInstance()
      case RepositoryTypes.TypeOrm:
        return SessionRepositoryTypeORM.getInstance()
    }
  }
}
