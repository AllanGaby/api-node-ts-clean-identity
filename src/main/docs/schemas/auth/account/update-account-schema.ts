export const updateAccountRequestSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'User name'
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'E-mail address to authentication and comunication of API'
    },
    password: {
      type: 'string',
      format: 'password',
      description: 'Access password'
    },
    new_password: {
      type: 'string',
      format: 'password',
      description: 'New access password'
    },
    password_confirmation: {
      type: 'string',
      format: 'password',
      description: 'Password confirmation'
    }
  }
}
