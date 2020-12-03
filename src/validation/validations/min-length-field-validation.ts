import { Validation } from '@/validation/protocols/validation'
import { InvalidParamError } from '@/validation/errors'

export class MinLengthFieldValidation implements Validation {
  constructor (
    private readonly field: string,
    private readonly minLength: number) {}

  validate (input: any): Error {
    const value = input[this.field] as string
    if (value?.length < this.minLength) {
      return new InvalidParamError(this.field)
    }
  }
}
