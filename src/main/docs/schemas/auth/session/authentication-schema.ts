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
    account: {
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
        avatar_file_id: {
          type: 'string',
          format: 'uuid',
          description: 'Avatar file id, used to get avatar file'
        }
      }
    }
  }
}
