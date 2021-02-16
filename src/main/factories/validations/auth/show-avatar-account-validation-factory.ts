import { ValidationComposite, ValidationBuilder } from '@/validation/validations'

export const makeShowAvatarAccountValidation = (): ValidationComposite => {
  return new ValidationComposite(ValidationBuilder.field('avatar_id').required().build())
}
