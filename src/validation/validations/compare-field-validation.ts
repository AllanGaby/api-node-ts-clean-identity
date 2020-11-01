import { Validation } from '@/validation/protocols/validation'
import { InvalidParamError } from '../errors'

export class CompareFieldValidation implements Validation {
  constructor (
    private readonly field: string,
    private readonly compareField: string
  ) {}

  validate (input: any): Error {
    if (input[this.field] !== input[this.compareField]) {
      return new InvalidParamError(this.field)
    }
  }
}
