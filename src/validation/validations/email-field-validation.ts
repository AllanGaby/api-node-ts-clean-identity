import { Validation } from '@/validation/protocols/validation'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { InvalidParamError } from '../errors'

export class EmailFieldValidation implements Validation {
  constructor (
    private readonly field: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error {
    if (!this.emailValidator.isValid(input[this.field])) {
      return new InvalidParamError(this.field)
    }
  }
}
