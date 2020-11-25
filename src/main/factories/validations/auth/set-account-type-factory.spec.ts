import { makeSetAccountTypeValidation } from './set-account-type-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'

jest.mock('@/validation/validations/validation-composite')

describe('makeSetAccountTypeValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSetAccountTypeValidation()
    const validations: Validation[] = [
      ...ValidationBuilder.field('account_id').required().build(),
      ...ValidationBuilder.field('account_type').required().build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
