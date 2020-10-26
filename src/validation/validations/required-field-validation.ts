import { Validation } from '@/validation/protocols/validation'
import { MissingParamError } from '@/validation/errors'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly field: string) {}

  validate (input: any): Error {
    if (!input[this.field]) {
      return new MissingParamError(this.field)
    }
  }
}
