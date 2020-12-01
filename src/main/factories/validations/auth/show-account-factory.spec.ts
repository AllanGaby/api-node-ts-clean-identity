import { makeShowAccountValidation } from './show-account-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'

jest.mock('@/validation/validations/validation-composite')

describe('makeShowAccountValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeShowAccountValidation()
    const validations: Validation[] = [
      ...ValidationBuilder.field('id').required().build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
