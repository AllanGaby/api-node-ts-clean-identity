import { CompareFieldValidation } from './compare-field-validation'
import { InvalidParamError } from '@/validation/errors'
import { mockInput } from '@/validation/tests/mock-validation'
import faker from 'faker'

interface sutTypes {
  sut: CompareFieldValidation
  field: string
  compareField: string
}

const makeSut = (): sutTypes => {
  const field = faker.database.column()
  const compareField = faker.random.uuid()
  const sut = new CompareFieldValidation(field, compareField)
  return {
    sut,
    field,
    compareField
  }
}

describe('CompareFieldValidation', () => {
  test('Should return InvalidParamError if different values', () => {
    const { sut, field, compareField } = makeSut()
    const error = sut.validate(mockInput(field, compareField, faker.internet.email(), faker.internet.url()))
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should return null if same values', () => {
    const { sut, field, compareField } = makeSut()
    const value = faker.random.words()
    const error = sut.validate(mockInput(field, compareField, value, value))
    expect(error).toBeFalsy()
  })
})
