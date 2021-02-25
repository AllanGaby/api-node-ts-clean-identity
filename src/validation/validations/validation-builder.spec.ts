import { ValidationBuilder as sut, EmailFieldValidation, RequiredFieldValidation, MinLengthFieldValidation, ConditionalRequiredFieldValidation } from './'
import { EmailValidatorSpy } from '@/validation/tests/mock-email-validator'
import { CompareFieldValidation } from './compare-field-validation'
import faker from 'faker'

const field = faker.database.column()

describe('ValidationBuilder', () => {
  test('Should return EmailValidation if call email method', () => {
    const emailValidator = new EmailValidatorSpy()
    const validations = sut.field(field).email(emailValidator).build()
    expect(validations).toEqual([
      new EmailFieldValidation(field, emailValidator)
    ])
  })

  test('Should return RequiredFieldValidation if call required method', () => {
    const validations = sut.field(field).required().build()
    expect(validations).toEqual([
      new RequiredFieldValidation(field)
    ])
  })

  test('Should return MinLengthFieldValidation if call min method', () => {
    const min = faker.random.number({ min: 1, max: 30 })
    const validations = sut.field(field).min(min).build()
    expect(validations).toEqual([
      new MinLengthFieldValidation(field, min)
    ])
  })

  test('Should return CompareFieldValidation if call sameAs method', () => {
    const compareField = faker.database.column()
    const validations = sut.field(field).sameAs(compareField).build()
    expect(validations).toEqual([
      new CompareFieldValidation(field, compareField)
    ])
  })

  test('Should return ConditionalRequiredFieldValidation if call conditionalRequired method', () => {
    const conditionalRequiredField = faker.database.column()
    const validations = sut.field(field).conditionalRequired(conditionalRequiredField).build()
    expect(validations).toEqual([
      new ConditionalRequiredFieldValidation(field, conditionalRequiredField)
    ])
  })

  test('Should return an validation list if call more then one method', () => {
    const compareField = faker.database.column()
    const conditionalRequiredField = faker.database.column()
    const min = faker.random.number({ min: 1, max: 30 })
    const emailValidator = new EmailValidatorSpy()
    const validations = sut.field(field).required().min(min).sameAs(compareField).email(emailValidator).conditionalRequired(conditionalRequiredField).build()
    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new MinLengthFieldValidation(field, min),
      new CompareFieldValidation(field, compareField),
      new EmailFieldValidation(field, emailValidator),
      new ConditionalRequiredFieldValidation(field, conditionalRequiredField)
    ])
  })
})
