export const showAvatarAccountPath = {
  get: {
    tags: ['Account'],
    summary: 'Method to show avatar account',
    security: [{
      apiKeyAuth: []
    }],
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
