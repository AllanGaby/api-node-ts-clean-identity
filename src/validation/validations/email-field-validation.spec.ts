import { EmailFieldValidation } from './email-field-validation'
import { EmailValidatorSpy } from '@/validation/test/mock-email-validator'
import faker from 'faker'
import { InvalidParamError } from '../errors'

interface sutTypes {
  sut: EmailFieldValidation
  emailValidatorSpy: EmailValidatorSpy
  field: string
}

const makeSut = (): sutTypes => {
  const field = faker.database.column()
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailFieldValidation(field, emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy,
    field
  }
}

const mockEmailInput = (field, value): any => ({
  [field]: value
})

describe('EmailFieldValidation', () => {
  test('Should call EmailValidator with correct value', () => {
    const { sut, emailValidatorSpy, field } = makeSut()
    const emailInput = mockEmailInput(field, faker.internet.email())
    sut.validate(emailInput)
    expect(emailValidatorSpy.email).toBe(emailInput[field])
  })

  test('Should return InvalidParamError if EmailValidator return false', () => {
    const { sut, emailValidatorSpy, field } = makeSut()
    emailValidatorSpy.isValidEmail = false
    const error = sut.validate(mockEmailInput(field, faker.internet.email()))
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should return null if EmailValidator return true', () => {
    const { sut, field } = makeSut()
    const error = sut.validate(mockEmailInput(field, faker.internet.email()))
    expect(error).toBeFalsy()
  })
})
