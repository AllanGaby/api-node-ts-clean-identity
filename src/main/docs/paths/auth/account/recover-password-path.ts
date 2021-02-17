export const recoverPasswordPath = {
  post: {
    tags: ['Usuário'],
    summary: 'Solicitação de recuperação de senha',
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
        description: 'Solicitação de recuperação de senha enviada com sucesso',
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
  },
  put: {
    tags: ['Usuário'],
    summary: 'Recupera a senha de acesso do usuário',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/recoverPassword'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Senha de acesso atualizada com sucesso',
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
