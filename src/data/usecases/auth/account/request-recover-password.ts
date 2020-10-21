import { RequestRecoverPasswordDTO } from '@/domain/dtos/auth/account'
import { RequestRecoverPassword } from '@/domain/usecases/auth/account'
import { GetAccountByEmailRepository } from '@/data/repositories/auth/account'

export class DbRequestRecoverPassword implements RequestRecoverPassword {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository
  ) {}

  async request ({ email }: RequestRecoverPasswordDTO): Promise<boolean> {
    await this.getAccountByEmailRepository.getAccountByEmail(email)
    return false
  }
}
