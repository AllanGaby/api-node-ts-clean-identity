import { ValidationComposite, ValidationBuilder } from '@/validation/validations'

export const makeRecoverPassowrdValidation = (minLengthPassword: number): ValidationComposite => {
  return new ValidationComposite([
    ...ValidationBuilder.field('session_id').required().build(),
    ...ValidationBuilder.field('password').required().min(minLengthPassword).build(),
    ...ValidationBuilder.field('password_confirmation').required().min(minLengthPassword).sameAs('password').build()
  ])
}
