export const activeAccountPath = {
  put: {
    tags: ['Account'],
    summary: 'Method to active user account',
    parameters: [{
      in: 'path',
      name: 'session_id',
      description: 'Session id to active account sended to account e-mail',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid'
      }
    }],
    responses: {
      200: {
        description: 'Account activated',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/accountModel'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
