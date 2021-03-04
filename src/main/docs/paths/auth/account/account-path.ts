import { badRequestRef, forbiddenRef, unauthorizedRef, serverErrorRef } from '@/main/docs/components/http'

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
        $ref: badRequestRef
      },
      401: {
        $ref: unauthorizedRef
      },
      403: {
        $ref: forbiddenRef
      },
      500: {
        $ref: serverErrorRef
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
        $ref: badRequestRef
      },
      401: {
        $ref: unauthorizedRef
      },
      403: {
        $ref: forbiddenRef
      },
      500: {
        $ref: serverErrorRef
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
        $ref: badRequestRef
      },
      401: {
        $ref: unauthorizedRef
      },
      403: {
        $ref: forbiddenRef
      },
      500: {
        $ref: serverErrorRef
      }
    }
  }
}
