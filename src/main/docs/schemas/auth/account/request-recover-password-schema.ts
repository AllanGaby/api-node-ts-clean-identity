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
