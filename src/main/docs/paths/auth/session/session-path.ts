export const authenticationPath = {
  post: {
    tags: ['Autenticação'],
    summary: 'Autenticação da conta do usuário',
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
        description: 'Autenticação efetuada com sucesso',
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
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Autenticação'],
    summary: 'Sair da sessão de acesso',
    responses: {
      204: {
        description: 'Sessão de acesso fechada com sucesso',
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
