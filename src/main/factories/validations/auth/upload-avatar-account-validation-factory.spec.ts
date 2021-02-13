import { makeUploadAvatarAccountValidation } from './upload-avatar-account-validation-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'

jest.mock('@/validation/validations/validation-composite')

describe('makeUpdateAccountValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeUploadAvatarAccountValidation()
    const validations: Validation[] = [
      ...ValidationBuilder.field('avatar_file_path').required().build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
