export const accountPath = {
  post: {
    tags: ['Usuário'],
    summary: 'Cria conta de usuário',
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
        description: 'Conta de usuário criada com sucesso',
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
    summary: 'Atualiza a conta do usuário',
    security: [{
      apiKeyAuth: []
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/updateAccountRequest'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Conta do usuário atualizada com sucesso',
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
    tags: ['Usuário'],
    summary: 'Exibe as informações do usuário autenticado',
    security: [{
      apiKeyAuth: []
    }],
    responses: {
      200: {
        description: 'Informações do usuário autenticado',
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
