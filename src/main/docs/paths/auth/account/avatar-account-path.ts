export const avatarAccountPath = {
  patch: {
    tags: ['Account'],
    summary: 'Method to upload avatar account',
    security: [{
      apiKeyAuth: []
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/avatarAccountRequest'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Account updated',
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
      401: {
        $ref: '#/components/unauthorized'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  get: {
    tags: ['Account'],
    summary: 'Method to show default avatar account',
    responses: {
      200: {
        description: 'Show avatar account',
        content: {
          'image/png': {
            schema: {
              type: 'string',
              format: 'binary'
            }
          }
        }
      }
    }
  }
}
