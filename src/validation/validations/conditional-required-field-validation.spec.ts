import { ConditionalRequiredFieldValidation } from './conditional-required-field-validation'
import { InvalidParamError } from '@/validation/errors'
import { mockInput } from '@/validation/tests/mock-validation'
import faker from 'faker'

interface sutTypes {
  sut: ConditionalRequiredFieldValidation
  field: string
  conditionalRequiredField: string
}

const makeSut = (): sutTypes => {
  const field = faker.database.column()
  const conditionalRequiredField = faker.random.uuid()
  const sut = new ConditionalRequiredFieldValidation(field, conditionalRequiredField)
  return {
    sut,
    field,
    conditionalRequiredField
  }
}

describe('ConditionalRequiredFieldValidation', () => {
  test('Should return InvalidParamError if only conditional field is provide', () => {
    const { sut, field, conditionalRequiredField } = makeSut()
    const error = sut.validate(mockInput(field, conditionalRequiredField, null, faker.internet.url()))
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should return null if only field is provide', () => {
    const { sut, field, conditionalRequiredField } = makeSut()
    const error = sut.validate(mockInput(field, conditionalRequiredField, faker.random.words(), null))
    expect(error).toBeFalsy()
  })

  test('Should return null if all fields is provide', () => {
    const { sut, field, conditionalRequiredField } = makeSut()
    const value = faker.random.words()
    const error = sut.validate(mockInput(field, conditionalRequiredField, value, value))
    expect(error).toBeFalsy()
  })
})
