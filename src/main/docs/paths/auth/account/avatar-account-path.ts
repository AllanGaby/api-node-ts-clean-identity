export const avatarAccountPath = {
  patch: {
    tags: ['Avatar do usuário'],
    summary: 'Define um avatar para o usuário',
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
        description: 'Avatar definido com sucesso',
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
  delete: {
    tags: ['Avatar do usuário'],
    summary: 'Exclui a imagem de avatar do usuário',
    security: [{
      apiKeyAuth: []
    }],
    responses: {
      200: {
        description: 'Imagem de avatar do usuário excluída com sucesso',
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
