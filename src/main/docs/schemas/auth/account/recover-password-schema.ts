export const requestRecoverPasswordSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'E-mail address to authentication and comunication of API'
    }
  },
  required: [
    'email'
  ]
}

export const recoverPasswordSchema = {
  type: 'object',
  properties: {
    session_id: {
      type: 'string',
      format: 'uuid',
      description: 'Session Id sended in e-mail to recover password'
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
    'email'
  ]
}
