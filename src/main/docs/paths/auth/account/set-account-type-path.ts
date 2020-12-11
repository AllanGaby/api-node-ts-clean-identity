export const setAccountTypePath = {
  put: {
    tags: ['Account'],
    summary: 'Method to update account type',
    security: [{
      apiKeyAuth: []
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/setAccountType'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Account type updated',
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
  }
}
