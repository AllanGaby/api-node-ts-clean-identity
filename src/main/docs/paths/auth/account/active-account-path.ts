export const activeAccountPath = {
  put: {
    tags: ['Usuário'],
    summary: 'Ativa a conta do usuário',
    parameters: [{
      in: 'path',
      name: 'session_id',
      description: 'Identificador único da sessão de acesso para a ativação da conta do usuário',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid'
      }
    }],
    responses: {
      200: {
        description: 'Conta do usuário ativada com sucesso',
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
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
