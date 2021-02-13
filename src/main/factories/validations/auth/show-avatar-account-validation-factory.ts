import { ValidationComposite, ValidationBuilder } from '@/validation/validations'

export const makeShowAvatarAccountValidation = (): ValidationComposite => {
  return new ValidationComposite(ValidationBuilder.field('file_id').required().build())
}
