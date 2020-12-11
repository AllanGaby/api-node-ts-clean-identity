export const requestRecoverPasswordPath = {
  post: {
    tags: ['Account'],
    summary: 'Method to request recover password',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/requestRecoverPassword'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Request recover password is succeeds',
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
