export const createAccountRequestSchema = {
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
    password_confirmation: {
      type: 'string',
      format: 'password',
      description: 'Password confirmation'
    }
  },
  required: [
    'name', 'email', 'password', 'password_confirmation'
  ]
}
