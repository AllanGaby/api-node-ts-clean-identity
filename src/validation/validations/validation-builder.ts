import { Validation, EmailValidator } from '@/validation/protocols'
import { CompareFieldValidation, EmailFieldValidation, MinLengthFieldValidation, RequiredFieldValidation, ConditionalRequiredFieldValidation } from './'

export class ValidationBuilder {
  constructor (
    private readonly field: string,
    private readonly validations: Validation[]
  ) {}

  static field (field: string): ValidationBuilder {
    return new ValidationBuilder(field, [])
  }

  email (emailValidator: EmailValidator): ValidationBuilder {
    this.validations.push(new EmailFieldValidation(this.field, emailValidator))
    return this
  }

  required (): ValidationBuilder {
    this.validations.push(new RequiredFieldValidation(this.field))
    return this
  }

  min (minLength: number): ValidationBuilder {
    this.validations.push(new MinLengthFieldValidation(this.field, minLength))
    return this
  }

  sameAs (compareField: string): ValidationBuilder {
    this.validations.push(new CompareFieldValidation(this.field, compareField))
    return this
  }

  conditionalRequired (conditionalRequiredField: string): ValidationBuilder {
    this.validations.push(new ConditionalRequiredFieldValidation(this.field, conditionalRequiredField))
    return this
  }

  build (): Validation[] {
    return this.validations
  }
}
