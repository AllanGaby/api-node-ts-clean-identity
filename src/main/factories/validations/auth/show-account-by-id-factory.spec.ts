import { makeShowAccountByIdValidation } from './show-account-by-id-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'

jest.mock('@/validation/validations/validation-composite')

describe('makeShowAccountByIdValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeShowAccountByIdValidation()
    const validations: Validation[] = [
      ...ValidationBuilder.field('account_id').required().build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
