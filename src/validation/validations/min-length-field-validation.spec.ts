import { MinLengthFieldValidation } from './min-length-field-validation'
import { InvalidParamError } from '@/validation/errors'
import faker from 'faker'

interface sutTypes {
  sut: MinLengthFieldValidation
  field: string
  minLength: number
}

const makeSut = (): sutTypes => {
  const field = faker.database.column()
  const minLength = faker.random.number({ min: 1, max: 20 })
  const sut = new MinLengthFieldValidation(field, minLength)
  return {
    sut,
    minLength,
    field
  }
}

describe('MinLengthFieldValidation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const { sut, field, minLength } = makeSut()
    const error = sut.validate({ [field]: faker.random.alphaNumeric(minLength - 1) })
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should return null if validation succeed', () => {
    const { sut, field, minLength } = makeSut()
    const error = sut.validate({ [field]: faker.random.alphaNumeric(minLength) })
    expect(error).toBeFalsy()
  })

  test('Should return null if field is null', () => {
    const { sut, field } = makeSut()
    const error = sut.validate({ [field]: null })
    expect(error).toBeFalsy()
  })
})
