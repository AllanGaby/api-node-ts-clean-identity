export const authenticationPath = {
  post: {
    tags: ['Authentication'],
    summary: 'Method to authentication user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/authenticationRequest'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/authenticationResponse'
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
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  delete: {
    tags: ['Authentication'],
    summary: 'Method to logout session account',
    responses: {
      204: {
        description: 'Success',
        $ref: '#/components/noContent'
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
