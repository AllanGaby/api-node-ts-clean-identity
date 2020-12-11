import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '@/validation/errors'
import faker from 'faker'

interface sutTypes {
  sut: RequiredFieldValidation
  field: string
}

const makeSut = (): sutTypes => {
  const field = faker.database.column()
  const sut = new RequiredFieldValidation(field)
  return {
    sut,
    field
  }
}

describe('RequiredFieldValidation', () => {
  test('Should return MissingParamError if required field not found', () => {
    const { sut, field } = makeSut()
    const error = sut.validate({ invalidField: faker.random.words() })
    expect(error).toEqual(new MissingParamError(field))
  })

  test('Should return null if fill required field', () => {
    const { sut, field } = makeSut()
    const error = sut.validate({ [field]: faker.random.words() })
    expect(error).toBeFalsy()
  })
})
