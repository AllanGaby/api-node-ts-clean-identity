export const authenticationRequestSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'E-mail address to authentication'
    },
    password: {
      type: 'string',
      description: 'Access password'
    }
  },
  required: [
    'email', 'password'
  ]
}

export const authenticationResponseSchema = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
      description: 'Access token of account session'
    },
    account_type: {
      type: 'integer',
      description: 'Account type (1 - Manager, 2 - Student)',
      enum: [1, 2]
    }
  }
}
