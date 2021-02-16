import { Validation } from '@/validation/protocols/validation'
import { InvalidParamError } from '../errors'

export class ConditionalRequiredFieldValidation implements Validation {
  constructor (
    private readonly field: string,
    private readonly conditionalRequiredField: string
  ) {}

  validate (input: any): Error {
    if ((input[this.conditionalRequiredField]) && (!input[this.field])) {
      return new InvalidParamError(this.field)
    }
  }
}
