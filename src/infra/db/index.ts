import { MemoryAccountRepository, MemorySessionRepository } from './memory/repositories/auth'
import { AccountRepositoryTypeORM, SessionRepositoryTypeORM } from './typeorm/repositories/auth'

export enum RepositoryTypes {
  TypeOrm = 'TypeORM',
  Memory = 'Memory'
}

export class RepositoryFactory {
  public static getAccountRepository (type: RepositoryTypes): MemoryAccountRepository | AccountRepositoryTypeORM {
    switch (type) {
      case RepositoryTypes.Memory:
        return MemoryAccountRepository.getInstance()
      case RepositoryTypes.TypeOrm:
        return AccountRepositoryTypeORM.getInstance()
    }
  }

  public static getSessionRepository (type: RepositoryTypes): MemorySessionRepository | SessionRepositoryTypeORM {
    switch (type) {
      case RepositoryTypes.Memory:
        return MemorySessionRepository.getInstance()
      case RepositoryTypes.TypeOrm:
        return SessionRepositoryTypeORM.getInstance()
    }
  }
}
