import { makeActiveAccountValidation } from './active-account-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'

jest.mock('@/validation/validations/validation-composite')

describe('makeCreateAccountValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeActiveAccountValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(ValidationBuilder.field('session_id').required().build())
  })
})
