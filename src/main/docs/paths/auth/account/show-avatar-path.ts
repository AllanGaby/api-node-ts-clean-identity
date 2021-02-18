export const showAvatarAccountPath = {
  get: {
    tags: ['Avatar do usuário'],
    summary: 'Busca o avatar da conta do usuário',
    parameters: [{
      in: 'path',
      name: 'account_id',
      description: 'Identificador da conta do usuário',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        description: 'Exibe a imagem do avatar do usuário',
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
