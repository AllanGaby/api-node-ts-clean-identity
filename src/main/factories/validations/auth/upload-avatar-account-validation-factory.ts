import { ValidationComposite, ValidationBuilder } from '@/validation/validations'

export const makeUploadAvatarAccountValidation = (): ValidationComposite => {
  return new ValidationComposite(ValidationBuilder.field('avatar_file_path').required().build())
}
