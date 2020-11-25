import { ValidationComposite, ValidationBuilder } from '@/validation/validations'

export const makeSetAccountTypeValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...ValidationBuilder.field('account_id').required().build(),
    ...ValidationBuilder.field('account_type').required().build()
  ])
}
