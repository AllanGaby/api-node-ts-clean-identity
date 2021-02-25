import { ValidationComposite } from './validation-composite'
import { ValidationSpy, mockInput } from '@/validation/tests/mock-validation'
import { InvalidParamError, MissingParamError } from '@/validation/errors'
import faker from 'faker'

interface sutTypes {
  sut: ValidationComposite
  validations: ValidationSpy[]
  field: string
}

const makeSut = (): sutTypes => {
  const validations = [
    new ValidationSpy(),
    new ValidationSpy()
  ]
  const field = faker.database.column()
  const sut = new ValidationComposite(validations)
  return {
    sut,
    field,
    validations
  }
}

describe('ValidationComposite', () => {
  test('Should return error if validations return error', () => {
    const { sut, field, validations } = makeSut()
    validations[1].error = new InvalidParamError(field)
    const error = sut.validate(mockInput)
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, field, validations } = makeSut()
    validations[0].error = new InvalidParamError(field)
    validations[1].error = new MissingParamError(field)
    const error = sut.validate(mockInput)
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should return null if validations succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate(mockInput)
    expect(error).toBeFalsy()
  })
})
