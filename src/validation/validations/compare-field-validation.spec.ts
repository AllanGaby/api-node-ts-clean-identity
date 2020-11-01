import { CompareFieldValidation } from './compare-field-validation'
import faker from 'faker'
import { InvalidParamError } from '@/validation/errors'
import { mockInput } from '@/validation/test/mock-validation'

interface sutTypes {
  sut: CompareFieldValidation
  field: string
  compareField: string
}

const makeSut = (): sutTypes => {
  const field = faker.database.column()
  const compareField = faker.database.column()
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
    const error = sut.validate(mockInput(field, compareField, faker.random.words(), faker.random.alphaNumeric(20)))
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should return null if same values', () => {
    const { sut, field, compareField } = makeSut()
    const value = faker.random.words()
    const error = sut.validate(mockInput(field, compareField, value, value))
    expect(error).toBeFalsy()
  })
})
