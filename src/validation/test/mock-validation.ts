import { Validation } from '@/validation/protocols/validation'
import { ValidationComposite } from '@/validation/validations'
import faker from 'faker'

export class ValidationSpy implements Validation {
  error: Error

  validate (input: any): Error {
    return this.error
  }
}

export class ValidationCompositeSpy extends ValidationComposite {
  params: any
  error: Error

  validate (input: any): Error {
    this.params = input
    return this.error
  }
}

export const mockInput = (
  field: string,
  compareField: string = faker.database.column(),
  value: string = faker.random.words(),
  compareValue: string = faker.random.words()): any => ({
  [field]: value,
  [compareField]: compareValue
})
