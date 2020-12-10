export const accountPath = {
  post: {
    tags: ['Account'],
    summary: 'Method to create user account',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/createAccountRequest'
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Account created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/sessionModel'
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
  }
}
