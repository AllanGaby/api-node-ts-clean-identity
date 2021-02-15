export const showAvatarAccountPath = {
  get: {
    tags: ['Account'],
    summary: 'Method to show avatar account',
    parameters: [{
      in: 'path',
      name: 'avatar_id',
      description: 'Avatar file id',
      required: true,
      schema: {
        type: 'string'
      }
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
