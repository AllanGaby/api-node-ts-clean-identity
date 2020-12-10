export const accountModelSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Account identification'
    },
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
    email_valided: {
      type: 'boolean'
    },
    type: {
      type: 'integer',
      description: 'Account type (1 - Manager, 2 - Student)',
      enum: [1, 2]
    },
    created_at: {
      type: 'string',
      format: 'date'
    },
    updated_at: {
      type: 'string',
      format: 'date'
    }
  }
}
