import { makeShowAvatarAccountValidation } from './show-avatar-account-validation-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'

jest.mock('@/validation/validations/validation-composite')

describe('makeShowAvatarAccountValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeShowAvatarAccountValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(ValidationBuilder.field('file_id').required().build())
  })
})
