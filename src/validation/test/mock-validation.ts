import { Validation } from '@/validation/protocols/validation'
import faker from 'faker'

export class ValidationSpy implements Validation {
  error: Error

  validate (input: any): Error {
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
