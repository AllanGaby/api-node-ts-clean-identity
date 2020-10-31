import { EmailValidator } from '@/validation/protocols/email-validator'

export class EmailValidatorSpy implements EmailValidator {
  isValidEmail: boolean = true
  email: string

  isValid (email: string): boolean {
    this.email = email
    return this.isValidEmail
  }
}
